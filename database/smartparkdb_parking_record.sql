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
-- Table structure for table `parking_record`
--

DROP TABLE IF EXISTS `parking_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parking_record` (
  `recordid` int NOT NULL AUTO_INCREMENT,
  `entry_time` datetime(6) DEFAULT NULL,
  `exit_time` datetime(6) DEFAULT NULL,
  `verified_by` int DEFAULT NULL,
  `guardid` int DEFAULT NULL,
  `slotid` int DEFAULT NULL,
  `vehicleid` int DEFAULT NULL,
  PRIMARY KEY (`recordid`),
  KEY `FK60xcy6h173cp0umgys0nw8m4t` (`guardid`),
  KEY `FKhvbx71jmv5u3921vmtqt4f669` (`slotid`),
  KEY `FKm36i8h9yrlkmitx6ipe6a0jho` (`vehicleid`),
  CONSTRAINT `FK60xcy6h173cp0umgys0nw8m4t` FOREIGN KEY (`guardid`) REFERENCES `guard` (`guardid`),
  CONSTRAINT `FKhvbx71jmv5u3921vmtqt4f669` FOREIGN KEY (`slotid`) REFERENCES `parking_slot` (`slotid`),
  CONSTRAINT `FKm36i8h9yrlkmitx6ipe6a0jho` FOREIGN KEY (`vehicleid`) REFERENCES `vehicle` (`vehicleid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parking_record`
--

LOCK TABLES `parking_record` WRITE;
/*!40000 ALTER TABLE `parking_record` DISABLE KEYS */;
INSERT INTO `parking_record` VALUES (1,'2025-12-03 06:47:00.000000',NULL,8,NULL,1,1),(2,'2025-12-03 06:52:00.000000',NULL,8,NULL,1,2),(3,'2025-12-03 07:02:00.000000',NULL,8,NULL,10,3),(4,'2025-12-03 07:18:00.000000',NULL,8,NULL,13,4),(5,'2025-12-03 07:19:00.000000',NULL,8,NULL,14,5),(6,'2025-12-02 09:13:00.000000',NULL,8,NULL,2,7),(7,'2025-12-02 09:33:00.000000',NULL,8,NULL,4,8),(8,'2025-12-02 09:46:00.000000',NULL,8,NULL,2,10);
/*!40000 ALTER TABLE `parking_record` ENABLE KEYS */;
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
