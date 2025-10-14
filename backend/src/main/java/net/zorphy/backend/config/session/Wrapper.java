package net.zorphy.backend.config.session;

import com.fasterxml.jackson.annotation.JsonTypeInfo;

public class Wrapper {
    @JsonTypeInfo(use=JsonTypeInfo.Id.CLASS, include=JsonTypeInfo.As.PROPERTY, property="class")
    public Object value;

    public Wrapper() {

    }

    public Wrapper(Object value) {
        this.value = value;
    }
}
