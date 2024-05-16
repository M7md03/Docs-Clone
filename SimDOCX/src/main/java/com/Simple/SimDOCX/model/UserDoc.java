package com.Simple.SimDOCX.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDoc {
    private String id;
    private String title;
    private String role;
}
