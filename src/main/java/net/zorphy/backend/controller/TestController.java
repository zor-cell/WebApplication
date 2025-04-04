package net.zorphy.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
public class TestController {
    @RequestMapping("/")
    public String getGreeting() {
        return "Hello world! This is a test message!";
    }
}
