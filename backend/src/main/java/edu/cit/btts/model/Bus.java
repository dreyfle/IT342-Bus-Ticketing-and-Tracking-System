package edu.cit.btts.model;

import jakarta.persistence.*;
import java.util.Objects;
import java.util.Set; // For one-to-many relationship with Trip

@Entity
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plate_number", unique = true, nullable = false, length = 20)
    private String plateNumber;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "operator", nullable = false, length = 100)
    private String operator;

    @Column(name = "row_count", nullable = false)
    private Integer rowCount; // Number of rows in the bus seating layout

    @Column(name = "column_count", nullable = false)
    private Integer columnCount; // Number of columns in the bus seating layout

    @Column(name = "row_label", length = 50) // Example: "A,B,C,D..." or "1,2,3,4..."
    private String rowLabel;

    @Column(name = "column_label", length = 50) // Example: "1,2,3,4..." or "A,B,C,D..."
    private String columnLabel;

    // A Bus can have multiple Trips
    // mappedBy indicates the field in the Trip entity that owns the relationship
    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Trip> trips; // Use Set to avoid duplicates and maintain uniqueness


    public Bus() {
    }

    public Bus(String plateNumber, String name, String operator, Integer rowCount, Integer columnCount, String rowLabel, String columnLabel) {
        this.plateNumber = plateNumber;
        this.name = name;
        this.operator = operator;
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.rowLabel = rowLabel;
        this.columnLabel = columnLabel;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getPlateNumber() {
        return plateNumber;
    }

    public void setPlateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public Integer getRowCount() {
        return rowCount;
    }

    public void setRowCount(Integer rowCount) {
        this.rowCount = rowCount;
    }

    public Integer getColumnCount() {
        return columnCount;
    }

    public void setColumnCount(Integer columnCount) {
        this.columnCount = columnCount;
    }

    public String getRowLabel() {
        return rowLabel;
    }

    public void setRowLabel(String rowLabel) {
        this.rowLabel = rowLabel;
    }

    public String getColumnLabel() {
        return columnLabel;
    }

    public void setColumnLabel(String columnLabel) {
        this.columnLabel = columnLabel;
    }

    public Set<Trip> getTrips() {
        return trips;
    }

    public void setTrips(Set<Trip> trips) {
        this.trips = trips;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Bus bus = (Bus) o;
        return Objects.equals(id, bus.id) && Objects.equals(plateNumber, bus.plateNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, plateNumber);
    }

    @Override
    public String toString() {
        return "Bus{" +
                "id=" + id +
                ", plateNumber='" + plateNumber + '\'' +
                ", name='" + name + '\'' +
                ", operator='" + operator + '\'' +
                ", rowCount=" + rowCount +
                ", columnCount=" + columnCount +
                '}';
    }
}