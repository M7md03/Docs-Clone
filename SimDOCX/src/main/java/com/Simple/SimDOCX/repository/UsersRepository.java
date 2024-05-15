package com.Simple.SimDOCX.repository;

import com.Simple.SimDOCX.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UsersRepository extends MongoRepository<User, ObjectId> {
}
