package com.Simple.SimDOCX.repository;

import com.Simple.SimDOCX.model.Role;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RolesRepository extends MongoRepository<Role, ObjectId> {

}
