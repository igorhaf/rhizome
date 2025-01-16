package com.backend.nexabuild.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WelcomeController {
    
    @GetMapping("/")
    @ResponseBody
    public String welcome() {
        return "Welcome to NexaBuild!";
    }
}