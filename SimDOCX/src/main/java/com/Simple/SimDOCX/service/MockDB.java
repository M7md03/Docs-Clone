package com.Simple.SimDOCX.service;

import com.Simple.SimDOCX.model.Doc;
import com.Simple.SimDOCX.model.User;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static java.lang.Math.abs;

public class MockDB {
    private static boolean valid = false;
    public static List<User> UsersDB = new ArrayList<>();
    public static List<Doc> DocsDB = new ArrayList<>();

    public static void initDB() {
        String s = "ssssssssssssssssssssssss";
        if (valid)
            return;
        for (char chr = 'a'; chr <= 'f'; chr++) {
            UsersDB.add(
                    new User(
                            "user_" + chr,
                            "user_" + chr + "_password",
                            "user_" + chr + "_salt"));
        }

        Random rand = new Random();
        for (int i = 1; i <= 9; i++) {
            DocsDB.add(
                    new Doc(
                            String.valueOf(s.replace('s', (char) ('0' + i))),
                            "title_" + i,
                            null,
                            UsersDB.get(abs(rand.nextInt()) % UsersDB.size()),
                            new ArrayList<User>() {
                                {
                                    add(UsersDB.get(abs(rand.nextInt()) % UsersDB.size()));
                                    add(UsersDB.get(abs(rand.nextInt()) % UsersDB.size()));
                                }
                            },
                            new ArrayList<User>() {
                                {
                                    add(UsersDB.get(abs(rand.nextInt()) % UsersDB.size()));
                                    add(UsersDB.get(abs(rand.nextInt()) % UsersDB.size()));
                                    add(UsersDB.get(abs(rand.nextInt()) % UsersDB.size()));
                                    add(UsersDB.get(abs(rand.nextInt()) % UsersDB.size()));
                                    add(UsersDB.get(abs(rand.nextInt()) % UsersDB.size()));
                                }
                            }));
        }
        valid = true;
        return;
    }
}
