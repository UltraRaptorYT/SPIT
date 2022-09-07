-- MySQL Script generated by MySQL Workbench
-- Sun Feb  6 02:55:26 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema it_products
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `it_products` ;

-- -----------------------------------------------------
-- Schema it_products
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `it_products` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `it_products` ;

-- -----------------------------------------------------
-- Table `it_products`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `it_products`.`user` ;

CREATE TABLE IF NOT EXISTS `it_products`.`user` (
  `userid` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `contact` INT NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `profile_pic_url` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `usercol_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 50
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `it_products`.`category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `it_products`.`category` ;

CREATE TABLE IF NOT EXISTS `it_products`.`category` (
  `categoryid` INT NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(45) NOT NULL,
  `category_pic_url` LONGTEXT NOT NULL,
  `description` LONGTEXT NOT NULL,
  PRIMARY KEY (`categoryid`),
  UNIQUE INDEX `id_UNIQUE` (`categoryid` ASC) VISIBLE,
  UNIQUE INDEX `category_UNIQUE` (`category` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 32
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `it_products`.`product`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `it_products`.`product` ;

CREATE TABLE IF NOT EXISTS `it_products`.`product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `product_pic_url` LONGTEXT NOT NULL,
  `description` LONGTEXT NOT NULL,
  `categoryid` INT NOT NULL,
  `brand` VARCHAR(45) NOT NULL,
  `price` DOUBLE(65,2) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  INDEX `categoryid_idx` (`categoryid` ASC) VISIBLE,
  CONSTRAINT `categoryid`
    FOREIGN KEY (`categoryid`)
    REFERENCES `it_products`.`category` (`categoryid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 41
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `it_products`.`cart`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `it_products`.`cart` ;

CREATE TABLE IF NOT EXISTS `it_products`.`cart` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `productid` INT NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `productid_idx` (`productid` ASC) VISIBLE,
  INDEX `userid_idx` (`userid` ASC) VISIBLE,
  CONSTRAINT `id`
    FOREIGN KEY (`userid`)
    REFERENCES `it_products`.`user` (`userid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `product`
    FOREIGN KEY (`productid`)
    REFERENCES `it_products`.`product` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 47
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `it_products`.`checkout_history`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `it_products`.`checkout_history` ;

CREATE TABLE IF NOT EXISTS `it_products`.`checkout_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `orderNo` VARCHAR(45) NOT NULL,
  `userid` INT NOT NULL,
  `productid` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(65,2) NOT NULL,
  `discount_price` DECIMAL(65,2) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `uID_idx` (`userid` ASC) VISIBLE,
  INDEX `pID_idx` (`productid` ASC) VISIBLE,
  CONSTRAINT `pID`
    FOREIGN KEY (`productid`)
    REFERENCES `it_products`.`product` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `uID`
    FOREIGN KEY (`userid`)
    REFERENCES `it_products`.`user` (`userid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `it_products`.`interest`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `it_products`.`interest` ;

CREATE TABLE IF NOT EXISTS `it_products`.`interest` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `categoryid` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_idx` (`userid` ASC) VISIBLE,
  INDEX `category_idx` (`categoryid` ASC) VISIBLE,
  CONSTRAINT `category`
    FOREIGN KEY (`categoryid`)
    REFERENCES `it_products`.`category` (`categoryid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `user`
    FOREIGN KEY (`userid`)
    REFERENCES `it_products`.`user` (`userid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 70
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `it_products`.`promo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `it_products`.`promo` ;

CREATE TABLE IF NOT EXISTS `it_products`.`promo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `productid` INT NOT NULL,
  `promoName` VARCHAR(45) NOT NULL,
  `promoDescription` LONGTEXT NOT NULL,
  `promo_pic_url` LONGTEXT NOT NULL,
  `startPromo` DATE NOT NULL,
  `endPromo` DATE NOT NULL,
  `discount` DECIMAL(3,2) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `productid_idx` (`productid` ASC) VISIBLE,
  CONSTRAINT `productid`
    FOREIGN KEY (`productid`)
    REFERENCES `it_products`.`product` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `it_products`.`review`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `it_products`.`review` ;

CREATE TABLE IF NOT EXISTS `it_products`.`review` (
  `reviewid` INT NOT NULL AUTO_INCREMENT,
  `productid` INT NOT NULL,
  `userid` INT NOT NULL,
  `rating` INT NOT NULL,
  `review` LONGTEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewid`),
  INDEX `'userid"_idx` (`userid` ASC) VISIBLE,
  INDEX `"productid"_idx` (`productid` ASC) VISIBLE,
  CONSTRAINT `"productid"`
    FOREIGN KEY (`productid`)
    REFERENCES `it_products`.`product` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `'userid"`
    FOREIGN KEY (`userid`)
    REFERENCES `it_products`.`user` (`userid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 19
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
