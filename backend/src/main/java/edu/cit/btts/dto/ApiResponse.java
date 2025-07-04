package edu.cit.btts.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL) // Only include non-null fields in JSON
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data; // Generic field to hold any data (e.g., a DTO)

    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.data = null; // Default to null
    }

    public ApiResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}