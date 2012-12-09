-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 09, 2012 at 05:38 PM
-- Server version: 5.5.25
-- PHP Version: 5.4.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `toddcom_p2`
--

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `created` int(11) NOT NULL,
  `modified` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` longtext NOT NULL,
  `type` varchar(4) NOT NULL,
  `title` text NOT NULL,
  `subtitle` text NOT NULL,
  `numcol` int(10) unsigned NOT NULL,
  `numseries` int(10) unsigned NOT NULL,
  `structure` varchar(1) NOT NULL,
  `seriesx_array` text NOT NULL,
  `seriesy_array` text NOT NULL,
  `columnname_array` longtext NOT NULL,
  `series_array` longtext NOT NULL,
  `header` varchar(1) NOT NULL,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=29 ;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_id`, `created`, `modified`, `user_id`, `content`, `type`, `title`, `subtitle`, `numcol`, `numseries`, `structure`, `seriesx_array`, `seriesy_array`, `columnname_array`, `series_array`, `header`) VALUES
(1, 1337674925, 1337674925, 6, 'Hello World', '', '', '', 0, 0, '', '', '', '', '', ''),
(2, 1337675508, 1337675508, 6, 'This is test #2', '', '', '', 0, 0, '', '', '', '', '', ''),
(3, 1337675531, 1337675531, 6, 'And this is test #3', '', '', '', 0, 0, '', '', '', '', '', ''),
(5, 1337749219, 1337749219, 10, 'I like to kick, stretch, annnnnnnd kick. IIIIIIIIIIIIIIIIII’m 50! Fifty years old', '', '', '', 0, 0, '', '', '', '', '', ''),
(6, 1337749403, 1337749403, 8, 'I''m 35 years old and I live in a van down by the river!', '', '', '', 0, 0, '', '', '', '', '', ''),
(7, 1337749505, 1337749505, 8, 'Hi. How is everybody? Good. Great.', '', '', '', 0, 0, '', '', '', '', '', ''),
(8, 1337749608, 1337749608, 9, 'You''reeee welcome!', '', '', '', 0, 0, '', '', '', '', '', ''),
(9, 1337749889, 1337749889, 11, 'You know who''s excited about Christmas? The credit card companies. ', '', '', '', 0, 0, '', '', '', '', '', ''),
(10, 1337749984, 1337749984, 6, 'Hiiiiiiii!! Just kidding, I don''t say "Hi" like that, I say "Hi" like this: Hiii! Just kidding, that was a little more normal than I say it. "Hi!" That''s how I say it, that''s how I say it -- just kidding.', '', '', '', 0, 0, '', '', '', '', '', ''),
(11, 1337750046, 1337750046, 6, 'Actually, there''s a few ways -- just kidding, there''s only one way -- just kidding, I don''t know how many ways there are -- just kidding, I do, there''s eight -- just kidding, there''s eighteen, I counted them -- just kidding, my friend did and she never lies -- just kidding, she lied once, but I wasn''t there -- just kidding, we''re not really friends, we work together -- just kidding, I work by myself -- just kidding, I work out by myself -- just kidding, I don''t work out, ''cause I kicked out of my gym -- just kidding, it closed -- just kidding!', '', '', '', 0, 0, '', '', '', '', '', ''),
(12, 1351976448, 1351976448, 6, 'So much is going on.', '', '', '', 0, 0, '', '', '', '', '', ''),
(13, 1351976530, 1351976530, 14, 'So much to do!', '', '', '', 0, 0, '', '', '', '', '', ''),
(14, 1351976549, 1351976549, 14, 'So much to do!', '', '', '', 0, 0, '', '', '', '', '', ''),
(15, 1351977620, 1351977620, 6, 'You are cool.', '', '', '', 0, 0, '', '', '', '', '', ''),
(16, 1351986294, 1351986294, 6, 'OMG OMG!', '', '', '', 0, 0, '', '', '', '', '', ''),
(27, 1355055660, 1355055660, 6, '', 'bar', 'Average Rainfall in Boston (inches)', '2011', 12, 0, '1', '-1', '-1', '[Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec]', '[3.36,3.38,4.32,3.74,3.49,3.68,3.43,3.35,3.44,3.94,3.99,3.78]', '1'),
(28, 1355070692, 1355070692, 6, '', '', 'Average Rainfall in Boston (inches)', '', 0, 0, '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `created` int(11) NOT NULL,
  `modified` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=42 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `created`, `modified`, `token`, `password`, `email`, `first_name`, `last_name`) VALUES
(6, 1337747231, 1337747231, 'b21ac5f54fdad86e258076c6bd174612cd0cfbb2', '9a8c2065ef4fcf1d8eddc9b9b5e95d381b555dc7', 'judy@gmail.com', 'Judy', 'Grimes'),
(7, 1337747352, 1337747352, 'b9a0818fd6f402c3f3fa260edab938635cc5dd71', '9b05e866142be0cc955791c72d24a3e099986f9d', 'anthony@gmail.com', 'Anthony', 'Crispino'),
(8, 1337747500, 1337747500, '6856899ff529963e89da03356b98264f2a4fe428', 'a10cde0c328c916a3705f4ad884722811c50f05d', 'matt@gmail.com', 'Matt', 'Foley'),
(9, 1337747521, 1337747521, 'ee2f725f2d72075e326ecf7eae1a6c26fbac690d', '6a6e51138204db3a4a9591485179e2dc14614ded', 'nick@gmail.com', 'Nick', 'Burns'),
(10, 1337747562, 1337747562, 'bd6fe3c206f277727c1a64f9e36393cdb310a15b', 'a8c282bf9122e2b543d4efd658daa5133ad9d68d', 'sally@gmail.com', 'Sally', 'O''Malley'),
(11, 1337747594, 1337747594, '392e484387c33bf8dadee259d9862d797068937f', 'f037178d754639764a61b30764acd9ec637f8dc7', 'debbie@gmail.com', 'Debbie', 'Downer'),
(12, 1337747740, 1337747740, '73e8bb849e42d71b66a13011b421eac57310b0c3', 'c09ee5f1a756f88581282f94ffc1afabd4ed681e', 'manuel@gmail.com', 'Manuel', 'Ortiz'),
(14, 1351976515, 1351976515, '172de7b30f093763584a8ac5ae76c62a15a38697', '1bee51f216b5b05d932058d2d660d0bc6e083a82', 'joe@gmail.com', 'Joe', 'Schmo'),
(37, 1355049429, 1355049429, '60ccef127bde4c1226355dcd1fc6be19f6c16072', '172d602be0e693f1a2d27a2f43d26afa525a7e18', 'todd.kawakita@gmail.com', 'T', 'K'),
(39, 1355049477, 1355049477, '2e2fc28d521dedb49feefd447bb9c0cdce0c7f48', '172d602be0e693f1a2d27a2f43d26afa525a7e18', 'todd.kawakita@gmail.com', 'T', 'K'),
(40, 1355049560, 1355049560, 'bd943958d2ec112896748cc9045d1b21345f4ef0', '60dd43e1928be5a19fcf9c7ca687d578293f2b4a', 'todd@todd.com', 'T', 'K'),
(41, 1355050218, 1355050218, 'b6b16079744f69bc8010ba9a858100c89e852cab', '60dd43e1928be5a19fcf9c7ca687d578293f2b4a', 'todd22@todd.com', 'T', 'K');

-- --------------------------------------------------------

--
-- Table structure for table `users_users`
--

CREATE TABLE `users_users` (
  `user_user_id` int(11) NOT NULL AUTO_INCREMENT,
  `created` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_id_followed` int(11) NOT NULL,
  PRIMARY KEY (`user_user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=33 ;

--
-- Dumping data for table `users_users`
--

INSERT INTO `users_users` (`user_user_id`, `created`, `user_id`, `user_id_followed`) VALUES
(13, 1351971284, 23, 23),
(16, 1351971505, 23, 28),
(22, 1351976554, 14, 14),
(23, 1351976579, 14, 12),
(24, 1351976583, 14, 11),
(28, 1351990246, 6, 7),
(29, 1351990247, 6, 6),
(31, 1351991829, 6, 11),
(32, 1351991831, 6, 8);
