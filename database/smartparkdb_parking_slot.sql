-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: smartparkdb
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `parking_slot`
--

DROP TABLE IF EXISTS `parking_slot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parking_slot` (
  `slotid` int NOT NULL AUTO_INCREMENT,
  `location` varchar(255) DEFAULT NULL,
  `slot_type` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `areaid` int DEFAULT NULL,
  `reserved_by` varchar(255) DEFAULT NULL,
  `reserved_for` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`slotid`),
  KEY `FKqnkhn84pg99hjbdsro0xsnfrc` (`areaid`),
  CONSTRAINT `FKqnkhn84pg99hjbdsro0xsnfrc` FOREIGN KEY (`areaid`) REFERENCES `parking_area` (`areaid`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parking_slot`
--

LOCK TABLES `parking_slot` WRITE;
/*!40000 ALTER TABLE `parking_slot` DISABLE KEYS */;
INSERT INTO `parking_slot` VALUES (1,'A-01','Standard','Occupied',NULL,NULL,NULL),(2,'A-02','Standard','Occupied',NULL,NULL,NULL),(3,'A-03','Standard','Available',NULL,NULL,NULL),(4,'A-04','Standard','Occupied',NULL,NULL,NULL),(5,'A-05','Standard','Available',1,NULL,NULL),(6,'A-06','Standard','Available',1,NULL,NULL),(7,'A-07','Standard','Available',1,NULL,NULL),(8,'A-08','Standard','Available',1,NULL,NULL),(9,'A-09','Standard','Available',1,NULL,NULL),(10,'A-10','Standard','Occupied',NULL,NULL,NULL),(11,'A-11','Standard','Available',1,NULL,NULL),(12,'A-12','Standard','Available',1,NULL,NULL),(13,'B-01','Standard','Occupied',NULL,NULL,NULL),(14,'B-02','Standard','Occupied',NULL,NULL,NULL),(15,'B-03','Standard','Available',1,NULL,NULL),(16,'B-04','Standard','Available',1,NULL,NULL),(17,'B-05','Standard','Available',1,NULL,NULL),(18,'B-06','Standard','Available',1,NULL,NULL),(19,'B-07','Standard','Available',1,NULL,NULL),(20,'B-08','Standard','Available',1,NULL,NULL);
/*!40000 ALTER TABLE `parking_slot` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-04  2:02:50
