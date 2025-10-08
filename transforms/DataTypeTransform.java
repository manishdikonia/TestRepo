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
import java.util.HashMap;

/**
 * Custom transformation for handling data type conversions between MySQL and PostgreSQL
 */
public class DataTypeTransform<R extends ConnectRecord<R>> implements Transformation<R> {
    
    public static final String OVERVIEW_DOC = "Transform data types between MySQL and PostgreSQL";
    
    private static final ConfigDef CONFIG_DEF = new ConfigDef()
            .define("source.database", ConfigDef.Type.STRING, "mysql", ConfigDef.Importance.HIGH,
                    "Source database type (mysql or postgres)")
            .define("target.database", ConfigDef.Type.STRING, "postgres", ConfigDef.Importance.HIGH,
                    "Target database type (mysql or postgres)");
    
    private String sourceDatabase;
    private String targetDatabase;
    
    @Override
    public void configure(Map<String, ?> props) {
        final SimpleConfig config = new SimpleConfig(CONFIG_DEF, props);
        sourceDatabase = config.getString("source.database");
        targetDatabase = config.getString("target.database");
    }
    
    @Override
    public R apply(R record) {
        if (record.value() == null) {
            return record;
        }
        
        final Struct value = (Struct) record.value();
        final Schema schema = value.schema();
        
        // Create new schema with transformed field types
        SchemaBuilder newSchemaBuilder = SchemaBuilder.struct();
        Map<String, Object> newValues = new HashMap<>();
        
        for (Field field : schema.fields()) {
            String fieldName = field.name();
            Object fieldValue = value.get(fieldName);
            Schema fieldSchema = field.schema();
            
            // Transform field based on source and target database types
            if (sourceDatabase.equals("mysql") && targetDatabase.equals("postgres")) {
                transformMySQLToPostgreSQL(fieldName, fieldValue, fieldSchema, newSchemaBuilder, newValues);
            } else if (sourceDatabase.equals("postgres") && targetDatabase.equals("mysql")) {
                transformPostgreSQLToMySQL(fieldName, fieldValue, fieldSchema, newSchemaBuilder, newValues);
            } else {
                // No transformation needed
                newSchemaBuilder.field(fieldName, fieldSchema);
                newValues.put(fieldName, fieldValue);
            }
        }
        
        Schema newSchema = newSchemaBuilder.build();
        Struct newValue = new Struct(newSchema);
        
        for (Map.Entry<String, Object> entry : newValues.entrySet()) {
            newValue.put(entry.getKey(), entry.getValue());
        }
        
        return record.newRecord(record.topic(), record.kafkaPartition(), record.keySchema(),
                record.key(), newSchema, newValue, record.timestamp());
    }
    
    private void transformMySQLToPostgreSQL(String fieldName, Object fieldValue, Schema fieldSchema,
                                          SchemaBuilder newSchemaBuilder, Map<String, Object> newValues) {
        Schema.Type type = fieldSchema.type();
        
        switch (type) {
            case INT8:
                // MySQL TINYINT to PostgreSQL SMALLINT
                newSchemaBuilder.field(fieldName, Schema.INT16_SCHEMA);
                newValues.put(fieldName, fieldValue != null ? ((Byte) fieldValue).shortValue() : null);
                break;
                
            case STRING:
                // Handle MySQL specific string types
                if (fieldName.toLowerCase().contains("json")) {
                    // MySQL JSON to PostgreSQL JSONB
                    newSchemaBuilder.field(fieldName, Schema.STRING_SCHEMA);
                    newValues.put(fieldName, fieldValue);
                } else {
                    newSchemaBuilder.field(fieldName, fieldSchema);
                    newValues.put(fieldName, fieldValue);
                }
                break;
                
            case BYTES:
                // MySQL BLOB to PostgreSQL BYTEA
                newSchemaBuilder.field(fieldName, Schema.BYTES_SCHEMA);
                newValues.put(fieldName, fieldValue);
                break;
                
            default:
                newSchemaBuilder.field(fieldName, fieldSchema);
                newValues.put(fieldName, fieldValue);
                break;
        }
    }
    
    private void transformPostgreSQLToMySQL(String fieldName, Object fieldValue, Schema fieldSchema,
                                          SchemaBuilder newSchemaBuilder, Map<String, Object> newValues) {
        Schema.Type type = fieldSchema.type();
        
        switch (type) {
            case INT16:
                // PostgreSQL SMALLINT to MySQL TINYINT (if value fits)
                if (fieldValue != null) {
                    Short shortValue = (Short) fieldValue;
                    if (shortValue >= Byte.MIN_VALUE && shortValue <= Byte.MAX_VALUE) {
                        newSchemaBuilder.field(fieldName, Schema.INT8_SCHEMA);
                        newValues.put(fieldName, shortValue.byteValue());
                    } else {
                        newSchemaBuilder.field(fieldName, Schema.INT16_SCHEMA);
                        newValues.put(fieldName, fieldValue);
                    }
                } else {
                    newSchemaBuilder.field(fieldName, Schema.INT8_SCHEMA);
                    newValues.put(fieldName, null);
                }
                break;
                
            case STRING:
                // Handle PostgreSQL specific string types
                if (fieldName.toLowerCase().contains("jsonb")) {
                    // PostgreSQL JSONB to MySQL JSON
                    newSchemaBuilder.field(fieldName, Schema.STRING_SCHEMA);
                    newValues.put(fieldName, fieldValue);
                } else {
                    newSchemaBuilder.field(fieldName, fieldSchema);
                    newValues.put(fieldName, fieldValue);
                }
                break;
                
            default:
                newSchemaBuilder.field(fieldName, fieldSchema);
                newValues.put(fieldName, fieldValue);
                break;
        }
    }
    
    @Override
    public ConfigDef config() {
        return CONFIG_DEF;
    }
    
    @Override
    public void close() {
        // Nothing to close
    }
}