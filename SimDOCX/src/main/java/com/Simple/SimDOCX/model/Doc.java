package com.Simple.SimDOCX.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

//@Document(collection = "Docs")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Doc {
    @Id
    private String id;
    private String title;
    private Object[] body;
    @DocumentReference
    private User owner;
    @DocumentReference
    private List<User> editors;
    @DocumentReference
    private List<User> viewers;
}
