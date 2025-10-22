package com.appdev.smartpark.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.smartpark.entity.Guard;

@Repository
public interface GuardRepository extends JpaRepository<Guard, Integer> {
}
