

CREATE TABLE `react_crud`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user` VARCHAR(45) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`));


  CREATE TABLE `react_crud`.`tasks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `task` VARCHAR(45) NOT NULL,
  `id_user` INT NOT NULL,
  PRIMARY KEY (`id`));
