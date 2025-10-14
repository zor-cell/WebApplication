package net.zorphy.backend.config.session;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;

/**
 * A custom Jackson JSON serializer that serializes final record DTOs for session serialization
 */
public class WrapperGenericJackson2JsonRedisSerializer extends GenericJackson2JsonRedisSerializer {
    public WrapperGenericJackson2JsonRedisSerializer(ObjectMapper mapper) {
        super(mapper);
    }

    @Override
    public byte[] serialize(Object value) {
        Object tempValue = value;
        if (value != null && value.getClass().isRecord()) {
            tempValue = new Wrapper(value);
        }
        return super.serialize(tempValue);
    }

    @Override
    public Object deserialize(byte[] source) {
        Object wrapper = super.deserialize(source);
        if (wrapper instanceof Wrapper) {
            return ((Wrapper) wrapper).value;
        } else {
            return wrapper;
        }
    }
}

