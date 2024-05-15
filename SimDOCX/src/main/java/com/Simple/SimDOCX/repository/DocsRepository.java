package com.Simple.SimDOCX.repository;

import com.Simple.SimDOCX.model.Doc;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DocsRepository extends MongoRepository<Doc, ObjectId> {
}
