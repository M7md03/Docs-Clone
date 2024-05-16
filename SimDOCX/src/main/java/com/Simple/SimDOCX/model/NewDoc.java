package com.Simple.SimDOCX.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewDoc {
    private String username;
    private String docId;
    private String docTitle;
    private String role;
}