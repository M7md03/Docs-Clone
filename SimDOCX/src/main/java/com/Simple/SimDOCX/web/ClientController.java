package com.Simple.SimDOCX.web;

import com.Simple.SimDOCX.model.Doc;
import com.Simple.SimDOCX.model.Role;
import com.Simple.SimDOCX.model.NewDoc;
import com.Simple.SimDOCX.model.UserDoc;
import com.Simple.SimDOCX.model.SignupData;
import com.Simple.SimDOCX.service.DocsService;
import com.Simple.SimDOCX.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;

@RestController
// @RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173/")
public class ClientController {

    @Autowired
    private DocsService docsService;

    @Autowired
    private UsersService usersService;

    @GetMapping("/allDocs")
    public List<Doc> getAllDocs() {
        return docsService.allDocs();
    }

    @PostMapping("api/signup")
    public ResponseEntity<String> signup(@RequestBody SignupData data) {
        if (usersService.userExists(data.getUsername())) {
            return new ResponseEntity<>("User already exists", HttpStatus.CONFLICT);
        } else if (usersService.createUser(data.getUsername(), data.getPassword())) {
            return new ResponseEntity<>("User created successfully", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("api/login")
    public ResponseEntity<String> login(@RequestBody SignupData data) {
        if (usersService.verifyUser(data.getUsername(), data.getPassword())) {
            return new ResponseEntity<>("User logged in successfully!", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("api/documents/{username}")
    public ResponseEntity<List<UserDoc>> getDocs(@PathVariable String username) {
        return ResponseEntity.ok(docsService.getDocs(username));
    }

    @PostMapping("api/createDoc")
    public ResponseEntity<String> createDoc(@RequestBody NewDoc newDoc) {
        if (docsService.createDoc(newDoc.getDocId(), newDoc.getDocTitle(), newDoc.getUsername())) {
            return new ResponseEntity<>("Document created successfully", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("api/deleteDoc")
    public ResponseEntity<String> deleteDoc(@RequestBody NewDoc newDoc) {
        if (docsService.deleteDoc(newDoc.getDocId())) {
            return new ResponseEntity<>("Document deleted successfully", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("api/renameDoc")
    public ResponseEntity<String> renameDoc(@RequestBody NewDoc newDoc) {
        if (docsService.renameDoc(newDoc.getDocId(), newDoc.getDocTitle())) {
            return new ResponseEntity<>("Document renamed successfully", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("api/shareDoc")
    public ResponseEntity<String> renameDoc(@RequestBody Role role) {
        if (docsService.shareDoc(role.getDocID(), role.getUsername(), role.getRole())) {
            return new ResponseEntity<>("Document shared successfully", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Failed to share document", HttpStatus.BAD_REQUEST);
        }
    }

}
