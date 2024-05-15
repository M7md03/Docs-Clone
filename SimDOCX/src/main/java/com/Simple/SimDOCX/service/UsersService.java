package com.Simple.SimDOCX.service;

//import BCrypt;
import com.Simple.SimDOCX.model.SignupData;
import com.Simple.SimDOCX.model.User;
import org.springframework.stereotype.Service;

@Service
public class UsersService {

    MockDB mockDB;

    public boolean createUser(String username, String password) {
        mockDB.initDB();
        try {
            String salt = BCrypt.gensalt();
            String hashedPassword = BCrypt.hashpw(password, salt);

            User user = new User();
            user.setUserName(username);
            user.setPassword(hashedPassword);
            user.setSalt(salt);

            mockDB.UsersDB.add(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean userExists(String username) {
        mockDB.initDB();
        return mockDB.UsersDB.stream().anyMatch(user -> user.getUserName().equals(username));
    }

    public boolean verifyUser(String username, String password) {
        //return true;
        mockDB.initDB();
        return mockDB.UsersDB.stream().anyMatch(user -> user.getUserName().equals(username) && BCrypt.checkpw(password, user.getPassword()));
    }

}
