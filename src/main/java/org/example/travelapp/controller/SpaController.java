package org.example.travelapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;



@Controller
public class SpaController {


    @RequestMapping(value = {
            "/",                        // Главная
            "/{path:^(?!api|static|uploads|favicon\\.ico|.*\\..*).*$}",
            "/**/{path:^(?!api|static|uploads|favicon\\.ico|.*\\..*).*$}"
    })
    public String redirectToIndex() {
        return "forward:/index.html";
    }
}

