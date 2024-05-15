package com.Simple.SimDOCX.service;

import com.Simple.SimDOCX.model.Doc;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocsService {
    MockDB mockDB;

    public List<Doc> allDocs() {
        mockDB.initDB();
        return mockDB.DocsDB;
    }

    public boolean saveDoc(String documentID, Object[] body) {
        mockDB.initDB();
        boolean flag = false;
        mockDB.DocsDB.forEach(doc -> {
            if (doc.getId().equals(documentID))
                doc.setBody(body);
        });
        System.out.println(documentID);
        return true;
    }
}
