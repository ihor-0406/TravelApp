package org.example.travelapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;



@Controller
public class SpaController {


    @RequestMapping(value = {
            "/",
            "/{path:^(?!api|static|uploads|favicon\\.ico|login|logout|oauth2|auth|error|actuator|.*\\..*).*$}",
            "/**/{path:^(?!api|static|uploads|favicon\\.ico|login|logout|oauth2|auth|error|actuator|.*\\..*).*$}"
    })
    public String redirectToIndex() {
        return "forward:/index.html";
    }
}

