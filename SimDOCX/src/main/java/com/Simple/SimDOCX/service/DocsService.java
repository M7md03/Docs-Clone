package com.Simple.SimDOCX.service;

import com.Simple.SimDOCX.model.Doc;
import com.Simple.SimDOCX.model.Role;
import com.Simple.SimDOCX.model.User;
import com.Simple.SimDOCX.model.UserDoc;
import com.Simple.SimDOCX.repository.UsersRepository;
import com.Simple.SimDOCX.repository.DocsRepository;
import com.Simple.SimDOCX.repository.RolesRepository;

import org.bson.types.ObjectId;
import java.util.ArrayList;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocsService {
    MockDB mockDB;

    private final DocsRepository docsRepository;
    private final RolesRepository rolesRepository;
    private final UsersRepository usersRepository;

    public DocsService(DocsRepository docsRepository, RolesRepository rolesRepository,
            UsersRepository usersRepository) {
        this.docsRepository = docsRepository;
        this.rolesRepository = rolesRepository;
        this.usersRepository = usersRepository;
    }

    public List<Doc> allDocs() {
        mockDB.initDB();
        return mockDB.DocsDB;
    }

    public boolean saveDoc(String documentID, Object[] body) {
        boolean flag = false;
        mockDB.DocsDB.forEach(doc -> {
            if (doc.getId().equals(documentID))
                doc.setBody(body);
        });
        System.out.println(documentID);
        return true;
    }

    public List<UserDoc> getDocs(String username) {
        List<Role> roles = rolesRepository.findAll();
        roles.removeIf(role -> !role.getUsername().equals(username));
        List<UserDoc> userDocs = new ArrayList<>(); // Add this line to initialize the list
        for (Role role : roles) {
            ObjectId docId = new ObjectId(role.getDocID()); // Convert the String document ID to ObjectId
            Doc doc = docsRepository.findById(docId).get();
            userDocs.add(new UserDoc(doc.getId(), doc.getTitle(), role.getRole()));
        }
        return userDocs; // Add this line to return the list
    }

    public boolean createDoc(String id, String title, String username) {
        Doc doc = new Doc();
        doc.setTitle(title);
        Optional<User> temp = usersRepository.findById(username);
        User user = null;
        if (temp.isPresent()) {
            user = temp.get();
        } else {
            return false;
        }
        doc.setOwner(user);
        doc.setEditors(new ArrayList<>());
        doc.setViewers(new ArrayList<>());
        docsRepository.save(doc);
        Role role = new Role();
        role.setDocID(doc.getId());
        role.setUsername(username);
        role.setRole("owner");
        rolesRepository.save(role);
        return true;
    }

    public boolean deleteDoc(String id) {
        List<Role> roles = rolesRepository.findAll();
        roles.removeIf(role -> !role.getRole().equals("owner"));
        for (Role role : roles) {
            if (role.getDocID().equals(id)) {
                rolesRepository.deleteById(role.getRoleID());
                docsRepository.deleteById(new ObjectId(id));
                return true;
            }
        }
        return false;
    }

    public boolean renameDoc(String id, String title) {
        List<Role> roles = rolesRepository.findAll();
        roles.removeIf(role -> !role.getRole().equals("owner") && !role.getRole().equals("editor"));
        for (Role role : roles) {
            if (role.getDocID().equals(id)) {
                Doc doc = docsRepository.findById(new ObjectId(id)).get();
                doc.setTitle(title);
                docsRepository.save(doc);
                return true;
            }
        }
        return false;
    }

    public boolean shareDoc(String docID, String username, String roleStr) {
        if (!usersRepository.existsById(username)) {
            return false;
        }
        List<Role> roles = rolesRepository.findAll();
        roles.removeIf(role -> role.getDocID() == null || role.getUsername() == null
                || !(role.getDocID().equals(docID) && role.getUsername().equals(username)));
        for (Role role : roles) {
            if (role.getRole().equals("owner")) {
                return false;
            } else if (role.getRole().equals(roleStr)) {
                return true;
            } else {
                rolesRepository.deleteById(role.getRoleID());
            }
        }
        Role role = new Role();
        role.setDocID(docID);
        role.setUsername(username);
        role.setRole(roleStr);
        rolesRepository.insert(role);
        return true;
    }
}
