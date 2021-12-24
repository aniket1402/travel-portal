package com.nagarro.travelportalserver.models;

/**
 * @author aniketgupta01
 *
 */
public class UserAuth {
    private String username;
    private String password;

    public UserAuth() {}

    public String getUsername() {
        return username;
    }

    public void setUsername(final String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(final String password) {
        this.password = password;
    }
}
