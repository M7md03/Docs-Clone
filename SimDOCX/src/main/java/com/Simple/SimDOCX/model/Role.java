package com.Simple.SimDOCX.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "Roles")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Role {
    @Id
    private ObjectId roleID;
    // @DocumentReference
    private String docID;
    // @DocumentReference
    private String username;
    private String role;

}
