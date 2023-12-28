-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 28-Dez-2023 às 15:10
-- Versão do servidor: 10.4.28-MariaDB
-- versão do PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `starseg`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `access`
--

CREATE TABLE `access` (
  `accessId` int(11) NOT NULL,
  `lobbyId` int(11) NOT NULL,
  `local` varchar(191) DEFAULT NULL,
  `reason` varchar(191) DEFAULT NULL,
  `visitorId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `endTime` datetime(3) DEFAULT NULL,
  `memberId` int(11) DEFAULT NULL,
  `operatorId` int(11) NOT NULL,
  `startTime` datetime(3) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `updatedAt` datetime(3) NOT NULL,
  `comments` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `access`
--

INSERT INTO `access` (`accessId`, `lobbyId`, `local`, `reason`, `visitorId`, `createdAt`, `endTime`, `memberId`, `operatorId`, `startTime`, `status`, `updatedAt`, `comments`) VALUES
(2, 1, 'teste', 'teste', 7, '2023-12-22 14:50:29.771', '2023-12-26 11:13:01.882', 1, 1, '2023-12-22 14:50:29.728', 'ACTIVE', '2023-12-26 11:13:01.982', 'teste'),
(3, 1, 'teste2', 'teste2', 3, '2023-12-22 14:52:39.266', '2023-12-26 12:48:28.752', 4, 1, '2023-12-21 12:00:00.000', 'INACTIVE', '2023-12-26 12:48:28.789', 'teste2'),
(4, 1, 'teste', 'teste', 5, '2023-12-26 11:09:06.768', NULL, 27, 1, '2023-12-26 11:09:06.756', 'ACTIVE', '2023-12-26 11:09:06.768', ''),
(6, 1, 'teste200', 'teste200', 6, '2023-12-26 11:46:20.483', '2023-12-26 08:59:00.000', 4, 1, '2023-12-21 12:40:00.000', 'INACTIVE', '2023-12-26 11:59:02.776', 'teste200'),
(7, 1, 'teste', 'teste', 7, '2023-12-26 12:56:44.311', NULL, 28, 2, '2023-12-26 12:56:44.300', 'ACTIVE', '2023-12-26 12:56:44.311', ''),
(8, 1, 'teste', 'teste', 14, '2023-12-26 13:42:38.324', NULL, 4, 2, '2023-12-26 13:42:38.317', 'ACTIVE', '2023-12-26 13:42:38.324', 'teste'),
(9, 1, 'Casa do morador', 'Encontro social', 5, '2023-12-28 13:58:07.896', NULL, 27, 1, '2023-12-28 13:58:07.882', 'ACTIVE', '2023-12-28 13:58:07.896', '');

-- --------------------------------------------------------

--
-- Estrutura da tabela `addresstype`
--

CREATE TABLE `addresstype` (
  `addressTypeId` int(11) NOT NULL,
  `description` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `addresstype`
--

INSERT INTO `addresstype` (`addressTypeId`, `description`) VALUES
(1, 'LOTE'),
(2, 'TÍTULO'),
(3, 'APTO');

-- --------------------------------------------------------

--
-- Estrutura da tabela `device`
--

CREATE TABLE `device` (
  `deviceId` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `ip` varchar(191) NOT NULL,
  `deviceModelId` int(11) NOT NULL,
  `lobbyId` int(11) NOT NULL,
  `description` varchar(191) NOT NULL,
  `ramal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `device`
--

INSERT INTO `device` (`deviceId`, `name`, `ip`, `deviceModelId`, `lobbyId`, `description`, `ramal`) VALUES
(1, 'Dispositivo 2', '192.168.3.5', 1, 2, 'Leitor de saída morador', 115),
(3, 'x', '192.185.6.3', 2, 1, 'entrada morador ok', 12),
(4, 'teste 1', '192.168.0.101', 1, 1, 'testes testes', 101),
(11, 'teste', 'teste', 1, 1, 'teste 123123213123', 124),
(12, 'micael', 'teste', 1, 1, 'teste123', 545),
(13, 'TESTE', '192.168.99.22', 2, 1, 'TESTER', 45),
(16, 'Leitor 1', '192.168.30.20', 1, 9, 'Leitor facial de entrada do morador', 20),
(17, 'teste', 'teste', 1, 9, 'teste', 31),
(18, 'Teste', '129.103.204.5', 1, 1, 'Teste', 23);

-- --------------------------------------------------------

--
-- Estrutura da tabela `devicemodel`
--

CREATE TABLE `devicemodel` (
  `deviceModelId` int(11) NOT NULL,
  `model` varchar(191) NOT NULL,
  `brand` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `devicemodel`
--

INSERT INTO `devicemodel` (`deviceModelId`, `model`, `brand`, `description`) VALUES
(1, 'SS 3540 MF FACE EX', 'Intelbras', 'Leitor Facial'),
(2, 'FaceID', 'ControlID', '');

-- --------------------------------------------------------

--
-- Estrutura da tabela `lobby`
--

CREATE TABLE `lobby` (
  `lobbyId` int(11) NOT NULL,
  `cnpj` varchar(191) NOT NULL,
  `responsible` varchar(191) NOT NULL,
  `telephone` varchar(191) NOT NULL,
  `schedules` varchar(191) NOT NULL,
  `procedures` varchar(191) DEFAULT NULL,
  `datasheet` varchar(191) DEFAULT NULL,
  `cep` varchar(191) NOT NULL,
  `city` varchar(191) NOT NULL,
  `complement` varchar(191) DEFAULT NULL,
  `neighborhood` varchar(191) NOT NULL,
  `number` varchar(191) NOT NULL,
  `state` varchar(191) NOT NULL,
  `street` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `type` enum('CONDOMINIUM','COMPANY') NOT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `lobby`
--

INSERT INTO `lobby` (`lobbyId`, `cnpj`, `responsible`, `telephone`, `schedules`, `procedures`, `datasheet`, `cep`, `city`, `complement`, `neighborhood`, `number`, `state`, `street`, `name`, `createdAt`, `type`, `updatedAt`) VALUES
(1, '33.743.214/0001-00', 'Daniela Almeida Gonçalves', '11968394212', 'Todos os dias - 22h às 06h', '', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/portarias%2Fficha-tecnica-2023-12-15T12%3A30%3A48.970Z.pdf?alt=media&token=c91d0e72-07ae-4a76-9b1f-d4c65aec7520', '36305-213', 'Extrema', 'Lado esquerdo', 'Bom Pastor', '537', 'MG', 'Rua Quirino Ferreira da Silva', 'Laranjeiras', '2023-12-04 16:44:02.185', 'CONDOMINIUM', '2023-12-18 11:08:21.779'),
(2, '43.556.986/0001-00', 'Walter Diaz', '11965423567', '24/7', NULL, NULL, '12970-000', 'Piracaia', NULL, 'Boa Vista', '123', 'SP', 'Avenida Peixe Frito', 'San Lorenzo', '2023-12-04 16:46:55.731', 'CONDOMINIUM', '2023-12-04 16:46:55.731'),
(3, '54.765.856/7131-45', 'Elaine Souza', '(11) 96303-5552', '24/7', '', '', '12970-000', 'Piracaia', '', 'Boa vista', '154', 'SP', 'Alameda Garça', 'Boa Vista', '2023-12-04 16:57:39.613', 'CONDOMINIUM', '2023-12-04 16:57:39.613'),
(9, '36.724.546/7658-76', 'Micael', '(11) 96560-3922', '24/7', '', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/portarias%2Fficha-tecnica-2023-12-07T12%3A02%3A32.659Z.pdf?alt=media&token=4ebbd9bc-7e20-498a-bc3d-d97077a9a7a9', '12970-000', 'Piracaia', '', 'Mimis', '750', 'SP', 'Rua da Barragem', 'Micael Company', '2023-12-07 11:07:48.614', 'COMPANY', '2023-12-07 15:07:17.375');

-- --------------------------------------------------------

--
-- Estrutura da tabela `lobbycalendar`
--

CREATE TABLE `lobbycalendar` (
  `lobbyCalendarId` int(11) NOT NULL,
  `date` datetime(3) NOT NULL,
  `description` varchar(191) NOT NULL,
  `lobbyId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `lobbycalendar`
--

INSERT INTO `lobbycalendar` (`lobbyCalendarId`, `date`, `description`, `lobbyId`) VALUES
(1, '1970-01-01 00:00:00.000', 'teste1', 2),
(4, '2024-01-01 03:00:00.000', 'Ano novo, portaria fechada a prestadores de serviço.', 2),
(5, '2023-12-25 03:00:00.000', 'Natal, portaria fechada a prestadores de serviço.', 2);

-- --------------------------------------------------------

--
-- Estrutura da tabela `lobbyproblem`
--

CREATE TABLE `lobbyproblem` (
  `lobbyProblemId` int(11) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `date` datetime(3) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `lobbyId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `operatorId` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `lobbyproblem`
--

INSERT INTO `lobbyproblem` (`lobbyProblemId`, `description`, `date`, `status`, `lobbyId`, `createdAt`, `operatorId`, `title`, `updatedAt`) VALUES
(1, 'teste1', '1970-01-01 00:00:00.000', 'ACTIVE', 2, '2023-12-19 14:37:40.997', 2, 'teste1', '2023-12-19 14:36:54.797'),
(2, 'oi getgrbrfrhtjnmmyhgmtgmhwtrnmtwntynwynwrawr', '2010-10-10 22:00:00.000', 'INACTIVE', 2, '2023-12-19 14:38:14.149', 1, 'teste2 oi', '2023-12-20 13:01:10.991'),
(4, 'Um caminhão explodiu o portão principal', '2023-11-17 00:00:00.000', 'ACTIVE', 2, '2023-12-20 11:38:55.909', 4, 'Portão principal quebrado', '2023-12-20 11:38:55.909'),
(5, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat molestiae dolores et aliquid perferendis alias similique repudiandae libero! Id accusantium officiis nam tenetur sapiente minima maiores, vel quos odit quis beatae non repudiandae fuga quidem? Praesentium assumenda quis esse facere inventore cum impedit architecto neque voluptates, necessitatibus rem est soluta?', '2023-12-20 11:39:51.865', 'ACTIVE', 2, '2023-12-20 11:39:51.881', 1, 'teste123\'', '2023-12-20 11:39:51.881'),
(6, 'teste', '2023-12-19 12:23:00.000', 'INACTIVE', 2, '2023-12-20 11:53:28.893', 1, 'teste', '2023-12-20 12:10:53.569'),
(7, 'rrlrlf t glilcjcl d d dlenrilr f fckçsosow r rlkoirlnwl rw', '2023-12-20 12:21:13.584', 'ACTIVE', 2, '2023-12-20 12:21:13.633', 1, 'abc', '2023-12-20 12:21:13.633');

-- --------------------------------------------------------

--
-- Estrutura da tabela `logging`
--

CREATE TABLE `logging` (
  `logId` int(11) NOT NULL,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `method` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `userAgent` varchar(191) NOT NULL,
  `operatorId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `member`
--

CREATE TABLE `member` (
  `memberId` int(11) NOT NULL,
  `type` enum('RESIDENT','EMPLOYEE') NOT NULL,
  `profileUrl` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `rg` varchar(191) NOT NULL,
  `cpf` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `comments` varchar(191) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `faceAccess` varchar(191) DEFAULT NULL,
  `biometricAccess` varchar(191) DEFAULT NULL,
  `remoteControlAccess` varchar(191) DEFAULT NULL,
  `passwordAccess` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `addressTypeId` int(11) DEFAULT NULL,
  `accessPeriod` varchar(191) DEFAULT NULL,
  `position` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `lobbyId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `member`
--

INSERT INTO `member` (`memberId`, `type`, `profileUrl`, `name`, `rg`, `cpf`, `email`, `comments`, `status`, `faceAccess`, `biometricAccess`, `remoteControlAccess`, `passwordAccess`, `address`, `addressTypeId`, `accessPeriod`, `position`, `createdAt`, `updatedAt`, `lobbyId`) VALUES
(1, 'RESIDENT', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/pessoas%2Ffoto-perfil-2023-12-15T12%3A26%3A50.424Z.jpeg?alt=media&token=00052afb-b400-4da1-80f4-54ebc7eb5242', 'Micael Miranda Inácio', '49.202.003-4', '399.640.023/11', 'micaelmiranda124@gmail.com', '', 'ACTIVE', 'true', 'true', 'false', '23344', '1234', 1, NULL, NULL, '2023-12-08 14:50:46.496', '2023-12-27 14:16:18.315', 1),
(2, 'RESIDENT', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/pessoas%2Ffoto-perfil-2023-12-13T13%3A14%3A58.620Z.jpeg?alt=media&token=3467be4d-b1ec-42c9-9087-26a638d6066d', 'teste teste', '45.745.745-7', '657.367.653/53', 'teste@teste.com', '', 'ACTIVE', 'true', 'false', 'true', '12323', 'abc', 2, NULL, NULL, '2023-12-08 15:03:30.873', '2023-12-13 13:15:00.606', 1),
(4, 'RESIDENT', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/pessoas%2Ffoto-perfil-2023-12-11T11%3A11%3A55.025Z.jpeg?alt=media&token=13527d85-10f3-4ea1-bfe8-93b5825c9a09', 'Peter Parker', '50.192.459-3', '340.594.110/23', 'spider@marvel.com', '', 'ACTIVE', 'true', 'true', 'false', '18755', '09', 3, NULL, NULL, '2023-12-11 11:11:57.268', '2023-12-14 14:51:26.920', 1),
(8, 'RESIDENT', '', 'teste', '33.143.752-1', '166.433.651/23', 'teste21@gmail.com', '', 'ACTIVE', 'true', 'false', 'false', '4376', '531', 2, NULL, NULL, '2023-12-11 13:22:55.551', '2023-12-15 11:09:34.130', 2),
(9, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste', '13.143.752-1', '166.433.351-2', 'teste321@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:23:12.846', '2023-12-11 13:23:12.846', 2),
(10, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste', '13.193.752-1', '166.933.351-2', 'teste4@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:23:29.590', '2023-12-11 13:23:29.590', 2),
(11, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste5', '55.193.752-1', '556.933.351-2', 'teste5@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:23:48.291', '2023-12-11 13:23:48.291', 2),
(12, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste6', '66.193.752-1', '666.933.351-2', 'teste6@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:24:02.352', '2023-12-11 13:24:02.352', 2),
(13, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste7', '77.193.752-1', '777.933.351-2', 'teste7@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:24:45.955', '2023-12-11 13:24:45.955', 2),
(14, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste8', '88.193.752-1', '888.933.351-2', 'teste8@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:24:55.047', '2023-12-11 13:24:55.047', 2),
(15, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste9', '99.193.752-1', '999.933.351-2', 'teste9@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:25:05.610', '2023-12-11 13:25:05.610', 2),
(16, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste10', '10.193.752-1', '100.933.351-2', 'teste10@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:25:22.726', '2023-12-11 13:25:22.726', 2),
(17, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste11', '11.193.752-1', '101.933.351-2', 'teste101@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:25:36.607', '2023-12-11 13:25:36.607', 2),
(18, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste12', '12.193.752-1', '102.933.351-2', 'teste102@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:25:49.242', '2023-12-11 13:25:49.242', 2),
(19, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste13', '13.193.752-1', '103.933.351-2', 'teste13@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:26:00.304', '2023-12-11 13:26:00.304', 2),
(20, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste14', '14.193.752-1', '104.933.351-2', 'teste14@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:26:14.756', '2023-12-11 13:26:14.756', 2),
(21, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste15', '15.193.752-1', '105.933.351-2', 'teste15@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:26:29.356', '2023-12-11 13:26:29.356', 2),
(22, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste16', '16.193.752-1', '106.933.351-2', 'teste16@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:26:44.094', '2023-12-11 13:26:44.094', 2),
(23, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste17', '17.193.752-1', '107.933.351-2', 'teste17@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:26:55.842', '2023-12-11 13:26:55.842', 2),
(24, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste18', '18.193.752-1', '108.933.351-2', 'teste18@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:27:07.144', '2023-12-11 13:27:07.144', 2),
(25, 'RESIDENT', 'https://data.starseg.com/profiles/002.png', 'teste19', '19.193.752-1', '109.933.351-2', 'teste19@gmail.com', NULL, 'ACTIVE', 'Y', NULL, NULL, '4376', NULL, NULL, NULL, NULL, '2023-12-11 13:27:18.199', '2023-12-11 13:27:18.199', 2),
(27, 'RESIDENT', '', 'jose azul', '41.345.678-2', '113.133.138/90', 'josazul95@outlook.com', 'não mora no local, vem apenas nos finais de semana ', 'ACTIVE', 'true', 'true', 'false', '1234', 'andar 2 apto1', 3, NULL, NULL, '2023-12-13 13:59:25.846', '2023-12-13 14:00:42.669', 1),
(28, 'RESIDENT', '', 'Marry', '49.993.939-2', '392.311.023/31', 'marry@gmail.com', '', 'ACTIVE', 'true', 'false', 'false', '12659', '54', 2, NULL, NULL, '2023-12-14 11:12:51.375', '2023-12-14 11:12:51.375', 1),
(30, 'EMPLOYEE', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/pessoas%2Ffoto-perfil-2023-12-18T14%3A31%3A23.212Z.jpeg?alt=media&token=e3b930aa-d07f-40cd-af47-3e645ceccb02', 'Romario Mendes Silveira', '33.020.550-4', '301.292.144/01', NULL, '', 'ACTIVE', 'true', 'true', 'true', '433111', NULL, NULL, 'Segunda a sexta, das 7h às 17h', 'Zelador', '2023-12-18 14:31:25.206', '2023-12-18 15:00:01.526', 9);

-- --------------------------------------------------------

--
-- Estrutura da tabela `operator`
--

CREATE TABLE `operator` (
  `operatorId` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `type` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `operator`
--

INSERT INTO `operator` (`operatorId`, `username`, `name`, `password`, `type`, `createdAt`, `updatedAt`, `status`) VALUES
(1, 'micael', 'Micael', '$2b$10$L0NHBTEtEl/FEoYyUgpyG.peCSpfzSuFrWQnb.beLNWG6oCiZtiTy', 'ADMIN', '2023-12-04 16:43:07.003', '2023-12-04 16:43:07.003', 'ACTIVE'),
(2, 'user1', 'Usuário 01', '$2b$10$J4R/mZlBe3H51uJ7Sz6Dz.86vDquwvmB28qLJiVeBMq7YUCxkOi5G', 'USER', '2023-12-19 12:14:48.875', '2023-12-26 12:55:44.336', 'ACTIVE'),
(4, 'mestre1', 'administrador', '$2b$10$TyrohGY6ZSTbLz7K1WKST.elQTSw.87QQHMvHTybj7jW/mfTngcmG', 'ADMIN', '2023-12-19 13:01:33.888', '2023-12-19 13:04:29.204', 'ACTIVE'),
(5, 'teste20', 'teste20', '$2b$10$.2A0/E6r.zkN4/9wNsNt3.5Sss3dBv4DfUwBkBQoFM2JnDSusA6SG', 'ADMIN', '2023-12-19 13:17:20.862', '2023-12-19 13:43:33.904', 'INACTIVE');

-- --------------------------------------------------------

--
-- Estrutura da tabela `scheduling`
--

CREATE TABLE `scheduling` (
  `reason` varchar(191) NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `visitorId` int(11) NOT NULL,
  `lobbyId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `location` varchar(191) NOT NULL,
  `memberId` int(11) DEFAULT NULL,
  `operatorId` int(11) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `updatedAt` datetime(3) NOT NULL,
  `schedulingId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `scheduling`
--

INSERT INTO `scheduling` (`reason`, `startDate`, `endDate`, `visitorId`, `lobbyId`, `createdAt`, `location`, `memberId`, `operatorId`, `status`, `updatedAt`, `schedulingId`) VALUES
('teste', '2023-12-26 03:00:00.000', '2024-01-02 14:52:23.569', 8, 1, '2023-12-26 14:52:24.673', 'teste', 4, 2, 'ACTIVE', '2023-12-26 14:52:24.673', 2),
('xxx', '2023-12-27 03:00:00.000', '2024-01-10 03:00:00.000', 5, 1, '2023-12-27 11:04:07.506', 'xxx', 1, 1, 'ACTIVE', '2023-12-27 11:44:55.327', 3),
('teste', '2023-12-25 03:00:00.000', '2023-12-26 03:00:00.000', 1, 1, '2023-12-27 11:05:25.368', 'teste', 28, 1, 'INACTIVE', '2023-12-27 11:45:01.390', 4);

-- --------------------------------------------------------

--
-- Estrutura da tabela `tag`
--

CREATE TABLE `tag` (
  `tagId` int(11) NOT NULL,
  `value` varchar(191) NOT NULL,
  `tagTypeId` int(11) NOT NULL,
  `memberId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `tag`
--

INSERT INTO `tag` (`tagId`, `value`, `tagTypeId`, `memberId`) VALUES
(8, '65452', 6, 28),
(9, '7653', 6, 28),
(10, '54424', 6, 28),
(11, '65464', 6, 28),
(12, '9907096', 5, 28),
(13, '87684784', 5, 28),
(24, '7553', 6, 4),
(25, '9785', 6, 4),
(26, '8953', 6, 4),
(27, '5555', 6, 4),
(28, '9764', 5, 4),
(29, '98757', 5, 4),
(40, '75855', 6, 30),
(41, '1111', 6, 30),
(42, '7653', 5, 30),
(48, '3123', 6, 1),
(49, '5679', 6, 1),
(50, '4324', 5, 1),
(51, '78ee8586', 5, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `tagtype`
--

CREATE TABLE `tagtype` (
  `tagTypeId` int(11) NOT NULL,
  `description` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `tagtype`
--

INSERT INTO `tagtype` (`tagTypeId`, `description`) VALUES
(4, 'Tag Veicular'),
(5, 'Cartão'),
(6, 'Tag');

-- --------------------------------------------------------

--
-- Estrutura da tabela `telephone`
--

CREATE TABLE `telephone` (
  `number` varchar(191) NOT NULL,
  `memberId` int(11) NOT NULL,
  `telephoneId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `telephone`
--

INSERT INTO `telephone` (`number`, `memberId`, `telephoneId`) VALUES
('(11) 95003-3334', 1, 1),
('(11) 09694-0203', 1, 2),
('(12) 13904-0500', 1, 3),
('(12) 90330-9034', 2, 4),
('(32) 56457-6898', 2, 5),
('(13) 94000-2229', 4, 7),
('(12) 34443-1222', 2, 10),
('(43) 14555-4333', 1, 13),
('(11) 97879-2345', 27, 14),
('(11) 40364-434_', 27, 15),
('(12) 04992-0342', 28, 16),
('(65) 42245-4211', 28, 17),
('(13) 45543-5315', 8, 18);

-- --------------------------------------------------------

--
-- Estrutura da tabela `vehicle`
--

CREATE TABLE `vehicle` (
  `vehicleId` int(11) NOT NULL,
  `licensePlate` varchar(191) NOT NULL,
  `brand` varchar(191) DEFAULT NULL,
  `model` varchar(191) DEFAULT NULL,
  `color` varchar(191) DEFAULT NULL,
  `comments` varchar(191) DEFAULT NULL,
  `memberId` int(11) NOT NULL,
  `tag` varchar(191) DEFAULT NULL,
  `vehicleTypeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `vehicle`
--

INSERT INTO `vehicle` (`vehicleId`, `licensePlate`, `brand`, `model`, `color`, `comments`, `memberId`, `tag`, `vehicleTypeId`) VALUES
(1, 'DWE0217', 'Renault', 'Clio', 'Prata', NULL, 1, '6763575', 1),
(2, 'EIJ7805', 'Fiat', 'Virtus', 'Azul', 'Estilizado do homem aranha', 4, '5422662', 1),
(3, 'DKT1932', 'Hyundai', 'HB20', 'Branco', '', 28, '8746546', 1),
(4, 'XCB3J71', 'Honda', 'Pop 150', 'Vermelho', 'Estilizado do homem aranha', 4, '09755532', 2);

-- --------------------------------------------------------

--
-- Estrutura da tabela `vehicletype`
--

CREATE TABLE `vehicletype` (
  `vehicleTypeId` int(11) NOT NULL,
  `description` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `vehicletype`
--

INSERT INTO `vehicletype` (`vehicleTypeId`, `description`) VALUES
(1, 'Carro'),
(2, 'Moto'),
(3, 'Caminhão'),
(4, 'Van'),
(5, 'Ônibus');

-- --------------------------------------------------------

--
-- Estrutura da tabela `visitor`
--

CREATE TABLE `visitor` (
  `visitorId` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `rg` varchar(191) NOT NULL,
  `cpf` varchar(191) NOT NULL,
  `visitorTypeId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `endDate` datetime(3) DEFAULT NULL,
  `phone` varchar(191) NOT NULL,
  `profileUrl` varchar(191) DEFAULT NULL,
  `relation` varchar(191) DEFAULT NULL,
  `startDate` datetime(3) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `updatedAt` datetime(3) NOT NULL,
  `lobbyId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `visitor`
--

INSERT INTO `visitor` (`visitorId`, `name`, `rg`, `cpf`, `visitorTypeId`, `createdAt`, `endDate`, `phone`, `profileUrl`, `relation`, `startDate`, `status`, `updatedAt`, `lobbyId`) VALUES
(1, 'Laura', '54.777.213-5', '123.456.789-09', 1, '2023-12-21 11:41:53.666', '2023-12-08 03:00:00.000', '(35) 12121-2132', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/pessoas%2Ffoto-perfil-visita-2023-12-22T12%3A51%3A04.138Z.jpeg?alt=media&token=ea0fe0a2-798f-414c-b900-74103d138bfc', 'teste', '2023-12-01 03:00:00.000', 'INACTIVE', '2023-12-22 12:51:22.404', 1),
(3, 'aaaaa', '99.999.999-9', '999.999.999/99', 2, '2023-12-21 14:29:53.645', '2023-12-29 13:12:12.060', '(99) 99999-9999', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/pessoas%2Ffoto-perfil-visita-2023-12-21T14%3A29%3A51.474Z.jpeg?alt=media&token=daf66682-5500-446a-bc60-f5f375c9852a', 'a', '2023-12-14 03:00:00.000', 'ACTIVE', '2023-12-22 13:12:17.039', 1),
(4, 'teste', '87.598.975-9', '568.726.247/42', 2, '2023-12-21 14:31:04.921', '2024-01-20 14:31:01.469', '(34) 21313-5453', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/pessoas%2Ffoto-perfil-visita-2023-12-21T14%3A31%3A03.041Z.jpeg?alt=media&token=9c50fad7-a08b-4394-bcb5-6356ab0f7803', 'teste', '2023-12-28 03:00:00.000', 'ACTIVE', '2023-12-21 14:31:04.921', 2),
(5, 'Carl Smith', '22.222.222-2', '111.111.111/11', 2, '2023-12-22 12:17:58.660', '2033-12-19 12:58:05.619', '(33) 33333-3333', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/pessoas%2Ffoto-perfil-visita-2023-12-21T14%3A29%3A51.474Z.jpeg?alt=media&token=daf66682-5500-446a-bc60-f5f375c9852a', 'aaa', '2023-12-28 03:00:00.000', 'ACTIVE', '2023-12-28 11:03:18.090', 1),
(6, 'Edson Pinto Mesquita', '12.345.677-8', '113.133.138/90', 2, '2023-12-22 13:02:20.056', '2023-12-29 13:01:50.727', '(11) 97270-8939', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/pessoas%2Ffoto-perfil-visita-2023-12-22T13%3A02%3A18.216Z.jpeg?alt=media&token=39cefe11-fdad-47f0-80af-1c070b06e644', 'starseg', '2023-12-22 03:00:00.000', 'INACTIVE', '2023-12-22 13:03:11.154', 1),
(7, 'Bianca Cardoso', '12.345.678-9', '438.026.128/09', 1, '2023-12-22 13:10:20.093', '2024-01-21 13:09:43.884', '(11) 97575-2647', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/pessoas%2Ffoto-perfil-visita-2023-12-22T13%3A10%3A18.414Z.jpeg?alt=media&token=53a26a4d-1f88-483c-9bc1-3d3f2473091e', 'IRMÃ', '2023-12-22 03:00:00.000', 'ACTIVE', '2023-12-28 11:03:46.095', 1),
(8, 'Nicole', '49.492.020-3', '659.392.010/13', 1, '2023-12-26 13:29:34.383', '2024-01-25 13:28:05.215', '(10) 20394-9002', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/pessoas%2Ffoto-perfil-visita-2023-12-26T13%3A29%3A32.263Z.jpeg?alt=media&token=9ea8dcb8-1e54-4f11-b450-2b8fff2d3d4b', 'Prima', '2023-12-26 03:00:00.000', 'ACTIVE', '2023-12-26 13:29:34.383', 1),
(12, 'teste', '53.453.534-5', '345.343.453/45', 1, '2023-12-26 13:41:04.473', '2023-12-27 03:00:00.000', '(54) 54353-5354', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/pessoas%2Ffoto-perfil-visita-2023-12-26T13%3A41%3A02.894Z.jpeg?alt=media&token=106c4dcf-99cb-4ae1-8710-820847376cdc', '54353', '2023-12-26 03:00:00.000', 'ACTIVE', '2023-12-26 13:41:04.473', 1),
(14, 'James', '13.249.011-0', '593.049.520/40', 1, '2023-12-26 13:42:38.312', '2024-12-25 13:42:17.657', '(14) 03259-4530', 'https://firebasestorage.googleapis.com/v0/b/star-condomine.appspot.com/o/pessoas%2Ffoto-perfil-visita-2023-12-26T13%3A42%3A35.833Z.jpeg?alt=media&token=c6673b22-f7ad-4e8d-9979-36371078873a', 'teste', '2023-12-26 03:00:00.000', 'ACTIVE', '2023-12-26 13:42:38.312', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `visitortype`
--

CREATE TABLE `visitortype` (
  `visitorTypeId` int(11) NOT NULL,
  `description` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `visitortype`
--

INSERT INTO `visitortype` (`visitorTypeId`, `description`) VALUES
(1, 'Visita Social'),
(2, 'Prestador de Serviço');

-- --------------------------------------------------------

--
-- Estrutura da tabela `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('08583f9e-0cc9-418b-943b-60eed2b63295', '94100c1cba73743971709da1ceff2357adb10f8725fe42ad70f7ee8e27021e7b', '2023-12-19 11:55:14.532', '20231219115514_operator_update', NULL, NULL, '2023-12-19 11:55:14.523', 1),
('0e65cd58-e303-46c0-aede-d276f67e144b', '4a3195a3102ce3235c86cdbfbc4fa0c1b9c031fd4c6d53931237ad88b7b96242', '2023-12-04 16:26:05.090', '20231031193210_v1_2', NULL, NULL, '2023-12-04 16:26:05.064', 1),
('0ec91ab5-b5d9-411a-9a87-ac9ff012bb0d', '26c1cdfe312d9f07c424c6a7f9fa9f53455e7cd63f039682a19c80964014496a', '2023-12-21 13:16:48.832', '20231221131648_visitor_fix_2', NULL, NULL, '2023-12-21 13:16:48.821', 1),
('46960e6c-847c-4957-945f-2e201925cace', '9063175f14d80a921ed1531c28dce0452673381040c9cd05cee438f8ecbf99f6', '2023-12-04 16:26:05.264', '20231031200550_v1_3', NULL, NULL, '2023-12-04 16:26:05.091', 1),
('524c2642-d5fd-482d-8303-24d9e3ae7a68', '16b11f017a6c78a7d19cb362fd62959247f62beccb3d58caaa4cae7fd4bfdf34', '2023-12-19 14:47:56.600', '20231219144756_lobby_problem_update', NULL, NULL, '2023-12-19 14:47:56.592', 1),
('54879eed-755c-439d-8bc9-bdac00035275', 'a2d3154be1fc745a16c4d185d1e90771c26dfd59a2249a250762f10f41b35d8b', '2023-12-04 16:26:04.938', '20231031192044_v1', NULL, NULL, '2023-12-04 16:26:04.186', 1),
('66c69a3b-220c-4669-8f2b-9ed4cfed4c8d', '2f032303d466c2282680b5bbfc5b7a7aa0bf1186b5adc767da22c3fcc99948f0', '2023-12-04 16:26:06.724', '20231121172051_v3_1_3', NULL, NULL, '2023-12-04 16:26:06.661', 1),
('68df19b1-ebb0-49af-99bd-b27c3489c158', 'fa6161d00f7fc9a67392078251af70df8c8e959233e4a9849f5a81448a502521', '2023-12-04 16:26:05.063', '20231031192557_v1_1', NULL, NULL, '2023-12-04 16:26:04.939', 1),
('81a0ac67-7a01-4e08-b9cb-f68ef2f9ce83', '3147d8dc4e29c1a652fefe1376cd7d1bd57e597ec70cc24361794502110db577', '2023-12-04 16:26:05.376', '20231101174342_v1_4', NULL, NULL, '2023-12-04 16:26:05.265', 1),
('836945c1-24ac-4b3b-98d4-c802909ddd32', 'bd918b3c2acf758b3d129492c709079f4342c8d9ce6eba1232bb3c78821cfdd4', '2023-12-04 16:26:06.356', '20231113192610_v3_0', NULL, NULL, '2023-12-04 16:26:05.523', 1),
('982ada52-7873-4af2-bdae-fb81d82bb5b6', 'f6b9d9bc541b9077b065b04c16b000b7e49f919d49dd0a7e9ac4c67a77055d57', '2023-12-21 11:39:22.686', '20231221113922_visitor_fix', NULL, NULL, '2023-12-21 11:39:22.633', 1),
('a42421a6-6093-46d5-bf48-c246a218b386', 'a89f387d8d0bea292ac461a944c6c16b5acbf8f0ab8ee72607ade50bd52d83a6', '2023-12-04 16:26:05.444', '20231101200021_v1_5', NULL, NULL, '2023-12-04 16:26:05.377', 1),
('af77312f-b1b4-4c54-a47c-1bff3af90099', '4e16ebe99ea87772ad700d676251810cbeeef00ba8d6d00e993fd9d93818ca8c', '2023-12-04 16:26:05.521', '20231101202038_v1_7', NULL, NULL, '2023-12-04 16:26:05.506', 1),
('b09eb718-ea86-4420-aeab-4820e9d31f8b', '06d40d8d69525fa3661560222a0fc4582f61de9b108ea55efbdab7bbefd48f8c', '2023-12-04 16:26:06.660', '20231116201831_v3_1_2', NULL, NULL, '2023-12-04 16:26:06.597', 1),
('c4df1b31-5bb3-40d2-8ca0-c05acf1833e4', 'f8b32852dd1607e943e77c6b63b3d3e7a1c5d4d81531fdf91776167a94f02720', '2023-12-04 16:26:06.519', '20231114192544_v3_1', NULL, NULL, '2023-12-04 16:26:06.357', 1),
('d8f82bbb-94f6-4b7c-86ea-9bf49c477d93', '21e611806977f7dbaf17cc91c3af6f0aed740ad87b3806054cd95d3a4d8fac3e', '2023-12-04 16:26:05.505', '20231101200739_v1_6', NULL, NULL, '2023-12-04 16:26:05.444', 1),
('dbf1c5fb-61e1-49e9-bd14-9f71688f2362', '5796de5760b85a9ba1f019a763d90f4a857fb5d9fa63597096210b201f749d34', '2023-12-04 16:26:04.185', '20231030140954_init', NULL, NULL, '2023-12-04 16:26:04.071', 1),
('ef96d473-fc7b-4843-a290-4d45babe64fc', 'bd5ef07baa5e99e224a0dbc3d8df1f079074c5aa31d4d58d2ef66f1314bb0848', '2023-12-04 16:26:06.595', '20231114192801_v3_1_1', NULL, NULL, '2023-12-04 16:26:06.520', 1);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `access`
--
ALTER TABLE `access`
  ADD PRIMARY KEY (`accessId`),
  ADD KEY `Access_lobbyId_fkey` (`lobbyId`),
  ADD KEY `Access_memberId_fkey` (`memberId`),
  ADD KEY `Access_operatorId_fkey` (`operatorId`),
  ADD KEY `Access_visitorId_fkey` (`visitorId`);

--
-- Índices para tabela `addresstype`
--
ALTER TABLE `addresstype`
  ADD PRIMARY KEY (`addressTypeId`);

--
-- Índices para tabela `device`
--
ALTER TABLE `device`
  ADD PRIMARY KEY (`deviceId`),
  ADD KEY `Device_deviceModelId_fkey` (`deviceModelId`),
  ADD KEY `Device_lobbyId_fkey` (`lobbyId`);

--
-- Índices para tabela `devicemodel`
--
ALTER TABLE `devicemodel`
  ADD PRIMARY KEY (`deviceModelId`);

--
-- Índices para tabela `lobby`
--
ALTER TABLE `lobby`
  ADD PRIMARY KEY (`lobbyId`),
  ADD UNIQUE KEY `Lobby_cnpj_key` (`cnpj`);

--
-- Índices para tabela `lobbycalendar`
--
ALTER TABLE `lobbycalendar`
  ADD PRIMARY KEY (`lobbyCalendarId`),
  ADD KEY `LobbyCalendar_lobbyId_fkey` (`lobbyId`);

--
-- Índices para tabela `lobbyproblem`
--
ALTER TABLE `lobbyproblem`
  ADD PRIMARY KEY (`lobbyProblemId`),
  ADD KEY `LobbyProblem_lobbyId_fkey` (`lobbyId`),
  ADD KEY `LobbyProblem_operatorId_fkey` (`operatorId`);

--
-- Índices para tabela `logging`
--
ALTER TABLE `logging`
  ADD PRIMARY KEY (`logId`),
  ADD KEY `Logging_operatorId_fkey` (`operatorId`);

--
-- Índices para tabela `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`memberId`),
  ADD UNIQUE KEY `Member_cpf_key` (`cpf`),
  ADD KEY `Member_addressTypeId_fkey` (`addressTypeId`),
  ADD KEY `Member_lobbyId_fkey` (`lobbyId`);

--
-- Índices para tabela `operator`
--
ALTER TABLE `operator`
  ADD PRIMARY KEY (`operatorId`),
  ADD UNIQUE KEY `Operator_username_key` (`username`);

--
-- Índices para tabela `scheduling`
--
ALTER TABLE `scheduling`
  ADD PRIMARY KEY (`schedulingId`),
  ADD KEY `Scheduling_visitorId_fkey` (`visitorId`),
  ADD KEY `Scheduling_lobbyId_fkey` (`lobbyId`),
  ADD KEY `Scheduling_memberId_fkey` (`memberId`),
  ADD KEY `Scheduling_operatorId_fkey` (`operatorId`);

--
-- Índices para tabela `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`tagId`),
  ADD KEY `Tag_tagTypeId_fkey` (`tagTypeId`),
  ADD KEY `Tag_memberId_fkey` (`memberId`);

--
-- Índices para tabela `tagtype`
--
ALTER TABLE `tagtype`
  ADD PRIMARY KEY (`tagTypeId`);

--
-- Índices para tabela `telephone`
--
ALTER TABLE `telephone`
  ADD PRIMARY KEY (`telephoneId`),
  ADD KEY `Telephone_memberId_fkey` (`memberId`);

--
-- Índices para tabela `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`vehicleId`),
  ADD UNIQUE KEY `Vehicle_licensePlate_key` (`licensePlate`),
  ADD UNIQUE KEY `Vehicle_tag_key` (`tag`),
  ADD KEY `Vehicle_vehicleTypeId_fkey` (`vehicleTypeId`),
  ADD KEY `Vehicle_memberId_fkey` (`memberId`);

--
-- Índices para tabela `vehicletype`
--
ALTER TABLE `vehicletype`
  ADD PRIMARY KEY (`vehicleTypeId`);

--
-- Índices para tabela `visitor`
--
ALTER TABLE `visitor`
  ADD PRIMARY KEY (`visitorId`),
  ADD UNIQUE KEY `Visitor_cpf_key` (`cpf`),
  ADD KEY `Visitor_visitorTypeId_fkey` (`visitorTypeId`),
  ADD KEY `Visitor_lobbyId_fkey` (`lobbyId`);

--
-- Índices para tabela `visitortype`
--
ALTER TABLE `visitortype`
  ADD PRIMARY KEY (`visitorTypeId`);

--
-- Índices para tabela `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `access`
--
ALTER TABLE `access`
  MODIFY `accessId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de tabela `addresstype`
--
ALTER TABLE `addresstype`
  MODIFY `addressTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `device`
--
ALTER TABLE `device`
  MODIFY `deviceId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de tabela `devicemodel`
--
ALTER TABLE `devicemodel`
  MODIFY `deviceModelId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `lobby`
--
ALTER TABLE `lobby`
  MODIFY `lobbyId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `lobbycalendar`
--
ALTER TABLE `lobbycalendar`
  MODIFY `lobbyCalendarId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `lobbyproblem`
--
ALTER TABLE `lobbyproblem`
  MODIFY `lobbyProblemId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `logging`
--
ALTER TABLE `logging`
  MODIFY `logId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `member`
--
ALTER TABLE `member`
  MODIFY `memberId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de tabela `operator`
--
ALTER TABLE `operator`
  MODIFY `operatorId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `scheduling`
--
ALTER TABLE `scheduling`
  MODIFY `schedulingId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `tag`
--
ALTER TABLE `tag`
  MODIFY `tagId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de tabela `tagtype`
--
ALTER TABLE `tagtype`
  MODIFY `tagTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `telephone`
--
ALTER TABLE `telephone`
  MODIFY `telephoneId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de tabela `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `vehicleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `vehicletype`
--
ALTER TABLE `vehicletype`
  MODIFY `vehicleTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `visitor`
--
ALTER TABLE `visitor`
  MODIFY `visitorId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de tabela `visitortype`
--
ALTER TABLE `visitortype`
  MODIFY `visitorTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `access`
--
ALTER TABLE `access`
  ADD CONSTRAINT `Access_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby` (`lobbyId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Access_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Access_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `operator` (`operatorId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Access_visitorId_fkey` FOREIGN KEY (`visitorId`) REFERENCES `visitor` (`visitorId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `device`
--
ALTER TABLE `device`
  ADD CONSTRAINT `Device_deviceModelId_fkey` FOREIGN KEY (`deviceModelId`) REFERENCES `devicemodel` (`deviceModelId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Device_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby` (`lobbyId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `lobbycalendar`
--
ALTER TABLE `lobbycalendar`
  ADD CONSTRAINT `LobbyCalendar_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby` (`lobbyId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `lobbyproblem`
--
ALTER TABLE `lobbyproblem`
  ADD CONSTRAINT `LobbyProblem_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby` (`lobbyId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `LobbyProblem_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `operator` (`operatorId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `logging`
--
ALTER TABLE `logging`
  ADD CONSTRAINT `Logging_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `operator` (`operatorId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `member`
--
ALTER TABLE `member`
  ADD CONSTRAINT `Member_addressTypeId_fkey` FOREIGN KEY (`addressTypeId`) REFERENCES `addresstype` (`addressTypeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Member_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby` (`lobbyId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `scheduling`
--
ALTER TABLE `scheduling`
  ADD CONSTRAINT `Scheduling_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby` (`lobbyId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Scheduling_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Scheduling_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `operator` (`operatorId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Scheduling_visitorId_fkey` FOREIGN KEY (`visitorId`) REFERENCES `visitor` (`visitorId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `tag`
--
ALTER TABLE `tag`
  ADD CONSTRAINT `Tag_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Tag_tagTypeId_fkey` FOREIGN KEY (`tagTypeId`) REFERENCES `tagtype` (`tagTypeId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `telephone`
--
ALTER TABLE `telephone`
  ADD CONSTRAINT `Telephone_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `vehicle`
--
ALTER TABLE `vehicle`
  ADD CONSTRAINT `Vehicle_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Vehicle_vehicleTypeId_fkey` FOREIGN KEY (`vehicleTypeId`) REFERENCES `vehicletype` (`vehicleTypeId`) ON UPDATE CASCADE;

--
-- Limitadores para a tabela `visitor`
--
ALTER TABLE `visitor`
  ADD CONSTRAINT `Visitor_lobbyId_fkey` FOREIGN KEY (`lobbyId`) REFERENCES `lobby` (`lobbyId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Visitor_visitorTypeId_fkey` FOREIGN KEY (`visitorTypeId`) REFERENCES `visitortype` (`visitorTypeId`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
