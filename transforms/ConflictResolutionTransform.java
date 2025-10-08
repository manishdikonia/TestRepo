package com.example.transforms;

import org.apache.kafka.common.config.ConfigDef;
import org.apache.kafka.connect.connector.ConnectRecord;
import org.apache.kafka.connect.data.Field;
import org.apache.kafka.connect.data.Schema;
import org.apache.kafka.connect.data.SchemaBuilder;
import org.apache.kafka.connect.data.Struct;
import org.apache.kafka.connect.transforms.Transformation;
import org.apache.kafka.connect.transforms.util.SimpleConfig;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Custom transformation for conflict resolution in bidirectional synchronization
 */
public class ConflictResolutionTransform<R extends ConnectRecord<R>> implements Transformation<R> {
    
    public static final String OVERVIEW_DOC = "Resolve conflicts in bidirectional database synchronization";
    
    private static final ConfigDef CONFIG_DEF = new ConfigDef()
            .define("conflict.resolution.strategy", ConfigDef.Type.STRING, "timestamp", ConfigDef.Importance.HIGH,
                    "Conflict resolution strategy: timestamp, source_priority, or custom")
            .define("source.priority", ConfigDef.Type.STRING, "mysql", ConfigDef.Importance.MEDIUM,
                    "Source database with higher priority (mysql or postgres)")
            .define("timestamp.field", ConfigDef.Type.STRING, "updated_at", ConfigDef.Importance.MEDIUM,
                    "Field name for timestamp-based conflict resolution")
            .define("sync.marker.field", ConfigDef.Type.STRING, "sync_source", ConfigDef.Importance.HIGH,
                    "Field name to mark the source of synchronization");
    
    private String conflictStrategy;
    private String sourcePriority;
    private String timestampField;
    private String syncMarkerField;
    
    // In-memory cache to track recent updates and prevent loops
    private static final Map<String, Long> recentUpdates = new ConcurrentHashMap<>();
    private static final long CACHE_EXPIRY_MS = 30000; // 30 seconds
    
    @Override
    public void configure(Map<String, ?> props) {
        final SimpleConfig config = new SimpleConfig(CONFIG_DEF, props);
        conflictStrategy = config.getString("conflict.resolution.strategy");
        sourcePriority = config.getString("source.priority");
        timestampField = config.getString("timestamp.field");
        syncMarkerField = config.getString("sync.marker.field");
    }
    
    @Override
    public R apply(R record) {
        if (record.value() == null) {
            return record;
        }
        
        final Struct value = (Struct) record.value();
        final Schema schema = value.schema();
        
        // Check if this is a sync loop (record originated from sync process)
        if (isSyncLoop(value)) {
            return null; // Drop the record to prevent infinite loop
        }
        
        // Add sync marker to identify the source
        SchemaBuilder newSchemaBuilder = SchemaBuilder.struct();
        for (Field field : schema.fields()) {
            newSchemaBuilder.field(field.name(), field.schema());
        }
        
        // Add sync marker field if not exists
        if (schema.field(syncMarkerField) == null) {
            newSchemaBuilder.field(syncMarkerField, Schema.STRING_SCHEMA);
        }
        
        Schema newSchema = newSchemaBuilder.build();
        Struct newValue = new Struct(newSchema);
        
        // Copy existing fields
        for (Field field : schema.fields()) {
            newValue.put(field.name(), value.get(field.name()));
        }
        
        // Add sync source marker
        String sourceDatabase = extractSourceDatabase(record.topic());
        newValue.put(syncMarkerField, sourceDatabase);
        
        // Apply conflict resolution if needed
        if (hasConflict(record, value)) {
            newValue = resolveConflict(record, newValue);
        }
        
        // Update cache to track this record
        updateCache(record, value);
        
        return record.newRecord(record.topic(), record.kafkaPartition(), record.keySchema(),
                record.key(), newSchema, newValue, record.timestamp());
    }
    
    private boolean isSyncLoop(Struct value) {
        // Check if record has sync marker indicating it came from sync process
        if (value.schema().field(syncMarkerField) != null) {
            String syncSource = (String) value.get(syncMarkerField);
            return syncSource != null && !syncSource.isEmpty();
        }
        return false;
    }
    
    private String extractSourceDatabase(String topic) {
        if (topic.startsWith("mysql")) {
            return "mysql";
        } else if (topic.startsWith("postgres")) {
            return "postgres";
        }
        return "unknown";
    }
    
    private boolean hasConflict(ConnectRecord<?> record, Struct value) {
        // Simple conflict detection based on cache
        String recordKey = generateRecordKey(record, value);
        Long lastUpdate = recentUpdates.get(recordKey);
        
        if (lastUpdate != null) {
            long currentTime = System.currentTimeMillis();
            return (currentTime - lastUpdate) < 5000; // 5 second window for conflicts
        }
        
        return false;
    }
    
    private Struct resolveConflict(ConnectRecord<?> record, Struct value) {
        switch (conflictStrategy) {
            case "timestamp":
                return resolveByTimestamp(value);
            case "source_priority":
                return resolveBySourcePriority(record, value);
            case "custom":
                return resolveCustom(value);
            default:
                return value; // No resolution, keep original
        }
    }
    
    private Struct resolveByTimestamp(Struct value) {
        // In a real implementation, you would compare timestamps with cached values
        // For now, we'll just add a resolution timestamp
        Schema schema = value.schema();
        SchemaBuilder newSchemaBuilder = SchemaBuilder.struct();
        
        for (Field field : schema.fields()) {
            newSchemaBuilder.field(field.name(), field.schema());
        }
        
        newSchemaBuilder.field("conflict_resolved_at", Schema.INT64_SCHEMA);
        
        Schema newSchema = newSchemaBuilder.build();
        Struct newValue = new Struct(newSchema);
        
        for (Field field : schema.fields()) {
            newValue.put(field.name(), value.get(field.name()));
        }
        
        newValue.put("conflict_resolved_at", System.currentTimeMillis());
        
        return newValue;
    }
    
    private Struct resolveBySourcePriority(ConnectRecord<?> record, Struct value) {
        String sourceDatabase = extractSourceDatabase(record.topic());
        
        if (sourceDatabase.equals(sourcePriority)) {
            // This source has priority, keep the record
            return value;
        } else {
            // Lower priority source, add marker but keep record
            Schema schema = value.schema();
            SchemaBuilder newSchemaBuilder = SchemaBuilder.struct();
            
            for (Field field : schema.fields()) {
                newSchemaBuilder.field(field.name(), field.schema());
            }
            
            newSchemaBuilder.field("priority_override", Schema.BOOLEAN_SCHEMA);
            
            Schema newSchema = newSchemaBuilder.build();
            Struct newValue = new Struct(newSchema);
            
            for (Field field : schema.fields()) {
                newValue.put(field.name(), value.get(field.name()));
            }
            
            newValue.put("priority_override", false);
            
            return newValue;
        }
    }
    
    private Struct resolveCustom(Struct value) {
        // Implement custom conflict resolution logic here
        // This could involve business rules, field-level merging, etc.
        return value;
    }
    
    private String generateRecordKey(ConnectRecord<?> record, Struct value) {
        // Generate a unique key for caching based on table and primary key
        String topic = record.topic();
        Object keyValue = record.key();
        return topic + ":" + (keyValue != null ? keyValue.toString() : "null");
    }
    
    private void updateCache(ConnectRecord<?> record, Struct value) {
        String recordKey = generateRecordKey(record, value);
        long currentTime = System.currentTimeMillis();
        
        recentUpdates.put(recordKey, currentTime);
        
        // Clean up expired entries
        recentUpdates.entrySet().removeIf(entry -> 
            (currentTime - entry.getValue()) > CACHE_EXPIRY_MS);
    }
    
    @Override
    public ConfigDef config() {
        return CONFIG_DEF;
    }
    
    @Override
    public void close() {
        recentUpdates.clear();
    }
}