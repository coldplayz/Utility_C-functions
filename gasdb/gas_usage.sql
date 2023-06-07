-- MySQL dump 10.13  Distrib 8.0.32, for Linux (aarch64)
--
-- Host: localhost    Database: gas_usage
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.20.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `refills`
--

DROP TABLE IF EXISTS `refills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `refilled` date NOT NULL,
  `exhausted` date NOT NULL,
  `maira_cost` int NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `refilled` (`refilled`),
  UNIQUE KEY `exhausted` (`exhausted`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refills`
--

LOCK TABLES `refills` WRITE;
/*!40000 ALTER TABLE `refills` DISABLE KEYS */;
INSERT INTO `refills` VALUES (1,'2023-05-21','2023-05-21',2300,'3kg; opposite Oando, Balogun, Ago');
/*!40000 ALTER TABLE `refills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usage_refill_1`
--

DROP TABLE IF EXISTS `usage_refill_1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usage_refill_1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `use_case` varchar(255) NOT NULL,
  `duration_minute` int NOT NULL,
  `heat_level` enum('low','average','high') DEFAULT NULL,
  `day_time` enum('morning','afternoon','evening') DEFAULT NULL,
  `use_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usage_refill_1`
--

LOCK TABLES `usage_refill_1` WRITE;
/*!40000 ALTER TABLE `usage_refill_1` DISABLE KEYS */;
INSERT INTO `usage_refill_1` VALUES (1,'cook ogbono soup',30,'average','evening','2023-05-21 00:00:00'),(2,'boil water',15,'average','morning','2023-05-22 00:00:00'),(3,'warm ogbono soup',17,'average','morning','2023-05-22 00:00:00'),(4,'warm ogbono soup',13,'average','evening','2023-05-22 16:52:00'),(5,'warm ogbono soup',15,'average','morning','2023-05-23 00:00:00'),(6,'warm ogbono soup',12,'average','evening','2023-05-23 00:00:00'),(7,'boil water',15,'average','morning','2023-05-23 00:00:00'),(8,'boil water',17,'average','morning','2023-05-24 00:00:00'),(9,'boil water',20,'average','evening','2023-05-24 00:00:00'),(10,'warm ogbono soup',9,'average','evening','2023-05-24 00:00:00'),(11,'warm ogbono soup',11,'average','morning','2023-05-24 00:00:00'),(12,'warm ogbono soup',12,'average','morning','2023-05-25 00:00:00'),(13,'boil water',12,'average','morning','2023-05-25 00:00:00'),(14,'warm ogbono soup',8,'average','evening','2023-05-25 00:00:00'),(15,'boil water',19,'average','evening','2023-05-25 00:00:00'),(16,'boil water',15,'average','morning','2023-05-26 00:00:00'),(17,'boil water',18,'average','evening','2023-05-26 00:00:00'),(18,'warm augmented ogbono',6,'average','evening','2023-05-26 00:00:00'),(19,'cook augmented ogbono',40,'average','morning','2023-05-26 00:00:00'),(20,'warm augmented ogbono',7,'average','morning','2023-05-27 00:00:00'),(21,'fry pancakes',30,'average','evening','2023-05-27 00:00:00'),(22,'boil 1m water',6,'average','morning','2023-05-27 00:00:00'),(23,'parboil beans',27,'average','evening','2023-05-27 00:00:00'),(24,'parboil beans',20,'average','evening','2023-05-27 00:00:00'),(25,'cook beans',80,'average','morning','2023-05-28 00:00:00'),(26,'boil water',17,'average','morning','2023-05-28 00:00:00'),(27,'warm beans',14,'average','evening','2023-05-28 00:00:00'),(28,'warm beans',15,'average','morning','2023-05-29 00:00:00'),(29,'boil water',18,'average','morning','2023-05-29 00:00:00'),(30,'warm beans',8,'average','evening','2023-05-29 00:00:00'),(31,'warm beans',6,'average','morning','2023-05-30 00:00:00'),(32,'cook egusi soup',52,'average','morning','2023-05-30 00:00:00'),(33,'warm egusi soup',15,'average','evening','2023-05-30 00:00:00'),(34,'boil water',14,'average','evening','2023-05-30 00:00:00'),(35,'warm egusi soup',7,'average','evening','2023-05-30 00:00:00'),(36,'warm egusi soup',10,'average','morning','2023-05-31 00:00:00'),(37,'fry egg sauce',18,'average','morning','2023-05-31 00:00:00'),(38,'boil water',14,'average','evening','2023-05-31 00:00:00'),(39,'warm egusi soup',11,'average','evening','2023-05-31 00:00:00'),(40,'warm egusi soup',6,'average','morning','2023-06-01 00:00:00'),(41,'cook yam',22,'average','morning','2023-06-01 00:00:00'),(42,'fry egg sauce',15,'average','morning','2023-06-01 00:00:00'),(43,'boil water',13,'average','evening','2023-06-01 00:00:00'),(44,'warm egg sauce',6,'average','evening','2023-06-01 00:00:00'),(45,'warm egusi soup',9,'average','evening','2023-06-01 00:00:00'),(46,'warm egusi soup',11,'average','morning','2023-06-02 00:00:00'),(47,'boil water',13,'average','morning','2023-06-02 00:00:00'),(48,'warm egusi soup',5,'average','evening','2023-06-02 00:00:00'),(49,'warm egusi soup',4,'average','morning','2023-06-03 00:00:00'),(50,'boil water',18,'average','morning','2023-06-03 00:00:00'),(51,'cook 2 indomie',18,'average','evening','2023-06-03 00:00:00'),(52,'parboil fish',10,'average','evening','2023-06-03 00:00:00');
/*!40000 ALTER TABLE `usage_refill_1` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `check_valid_use` BEFORE INSERT ON `usage_refill_1` FOR EACH ROW BEGIN
			DECLARE useCase VARCHAR(255);
			SELECT use_case INTO useCase
				FROM use_cases
				WHERE use_cases.use_case = NEW.use_case;
			IF useCase is NULL
				THEN
				
				SET NEW.use_case = 'UnrecognizedUseCase' + NEW.use_case;
			END IF;
		END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `use_cases`
--

DROP TABLE IF EXISTS `use_cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `use_cases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `use_case` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `use_case` (`use_case`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `use_cases`
--

LOCK TABLES `use_cases` WRITE;
/*!40000 ALTER TABLE `use_cases` DISABLE KEYS */;
INSERT INTO `use_cases` VALUES (1,'cook beans','beans'),(2,'cook egusi soup','soup'),(3,'cook augmented ogbono','soup'),(4,'cook ogbono soup','soup'),(5,'fry pancakes','flour'),(6,'parboil beans','beans'),(7,'cook yam','yam'),(8,'cook 2 indomie','indomie'),(9,'fry egg sauce','sauce'),(10,'boil water','water'),(11,'warm ogbono soup','soup'),(12,'warm beans','beans'),(13,'warm egusi soup','soup'),(14,'warm augmented ogbono','soup'),(15,'boil 1m water','water'),(16,'warm egg sauce','sauce'),(17,'parboil fish','fish'),(18,'cook okra soup','soup'),(19,'warm okra soup','soup');
/*!40000 ALTER TABLE `use_cases` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-07  9:51:54
