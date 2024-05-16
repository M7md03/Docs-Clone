package com.Simple.SimDOCX.service;

//import BCrypt;
import com.Simple.SimDOCX.repository.UsersRepository;
import com.Simple.SimDOCX.model.SignupData;
import com.Simple.SimDOCX.model.User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsersService {

    MockDB mockDB;

    private final UsersRepository usersRepository;

    public UsersService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public boolean createUser(String username, String password) {
        mockDB.initDB();
        try {
            String salt = BCrypt.gensalt();
            String hashedPassword = BCrypt.hashpw(password, salt);

            User user = new User();
            user.setUserName(username);
            user.setPassword(hashedPassword);
            user.setSalt(salt);

            // mockDB.UsersDB.add(user);
            usersRepository.insert(user);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean userExists(String username) {
        mockDB.initDB();
        return usersRepository.existsById(username);
        // return mockDB.UsersDB.stream().anyMatch(user ->
        // user.getUserName().equals(username));
    }

    public boolean verifyUser(String username, String password) {
        mockDB.initDB();
        Optional<User> temp = usersRepository.findById(username);
        if (temp.isPresent()) {
            User user = temp.get();
            return BCrypt.checkpw(password, user.getPassword());
        }
        return false;
    }

}
