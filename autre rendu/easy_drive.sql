-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 23 mars 2025 à 21:22
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `easy_drive`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`id_admin`, `email`, `password`) VALUES
(1, 'admin', '$2y$10$nVPVtUD5n8dCJXUu33xJzOB4ncCzntDUPIXbHrsvrZDqWujcwJ18m');

-- --------------------------------------------------------

--
-- Structure de la table `avis`
--

CREATE TABLE `avis` (
  `id_avis` int(11) NOT NULL,
  `evaluation` int(11) NOT NULL,
  `texte` varchar(255) NOT NULL,
  `date` date DEFAULT curdate(),
  `id_ecole` int(11) NOT NULL,
  `id_candid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `avis`
--

INSERT INTO `avis` (`id_avis`, `evaluation`, `texte`, `date`, `id_ecole`, `id_candid`) VALUES
(14, 4, 'Super AutoEcole, juste le moniteur mathias R est un peu trop fan de monster hunter et il ne parle que de ça ! ', '2025-03-23', 1, 1),
(15, 5, 'Carré meme si j\'ai que des mauvaises notes, je recommande ', '2025-03-23', 1, 1),
(16, 1, 'Les cours sont catastrophiques et les moniteurs sont horribles, je deconseille grandement', '2025-03-23', 1, 1),
(17, 5, 'Top je jure sur la vie dma merde, trop bien', '2025-03-23', 3, 15),
(18, 2, 'Trop la rage, j\'ai pas la moyenne donc il merite pas une bonne note\n', '2025-03-23', 3, 14),
(19, 1, 'Il y a pas de question sur monster hunter ou solo leveling dans les tests donc cela ne merite pas une bonne note ', '2025-03-23', 1, 8),
(20, 4, 'Du bon travail, rien a dire ', '2025-03-23', 1, 7),
(21, 5, 'c\'est carré frr', '2025-03-23', 2, 11);

-- --------------------------------------------------------

--
-- Structure de la table `candidat`
--

CREATE TABLE `candidat` (
  `id_candid` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `date_naissance` date NOT NULL,
  `date_inscription` date DEFAULT curdate(),
  `neph` int(11) DEFAULT NULL,
  `echecetg` varchar(255) DEFAULT NULL,
  `etg` varchar(255) DEFAULT NULL,
  `id_ecole` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `candidat`
--

INSERT INTO `candidat` (`id_candid`, `password`, `nom`, `prenom`, `phone`, `email`, `adresse`, `date_naissance`, `date_inscription`, `neph`, `echecetg`, `etg`, `id_ecole`) VALUES
(1, '$2b$10$6YhndHvb1aLHXCtOC3KB7ejS32yiLq6PIfNMD9xCibNTd0wLLrcim', 'Pierre', 'Paul Jack', '0102030405', 'pierre.paul@gmail.com', '10 impasse Thibaud de champagne', '2004-12-12', '2025-03-18', NULL, NULL, NULL, 1),
(7, '$2b$10$HHZvQ0X2dP4.OohHA8cmdOrArnmLpOdZ0Ud4mE/ODA3CQd7IlYl8S', 'Som', 'Yohan', '0102030405', 'yohan.som@gmail.com', '10 passage de la mer', '2005-07-15', '2025-03-21', NULL, NULL, NULL, 1),
(8, '$2b$10$7gXxZUhK2q6mR2Dk6g.PseXrr8zMdr4xJKLQszi6OP3UGGR4I6qam', 'Rakotomavo', 'Mathias', '0102030405', 'mathias.rakotomavo@gmail.com', '10 passage de la mer', '2005-05-07', '2025-03-21', NULL, NULL, NULL, 1),
(11, '$2b$10$NqsSCMAk6.hJd/.N4NhcJem730WrYHXCx1cYnopVGJR81Lj/flonu', 'Lopere', 'Alexandre', '0102030405', 'alexandre.lopere@gmail.com', '10 passage de la mer', '2005-08-23', '2025-03-23', NULL, NULL, NULL, 2),
(12, '$2b$10$fec9VkOjt0TuxGLyhid1He.h2beicC3gOAfrUwiCmfofnjE85gaQC', 'Pili', 'Marjorie', '0102030405', 'marjotie.pili@gmail.com', '10 passage de la mer', '2005-04-23', '2025-03-23', NULL, NULL, NULL, 2),
(13, '$2b$10$2WROEm6RygZepFenn7yXmujhyev.dcBL7tIbWfGqJtTMlGNGeEeIW', 'Brouillard', 'Thylia', '0102030405', 'thylia.brouillard@gmail.com', '10 passage de la mer', '2005-07-23', '2025-03-23', NULL, NULL, NULL, 2),
(14, '$2b$10$dqm7BlXmGslEmOU4pqiUgOO1F8dMRsUMWASLA9MaHMPYOgHYdpWG2', 'Prevot', 'Tom', '0102030405', 'tom.prevot@gmail.com', '10 passage de la mer', '2003-08-23', '2025-03-23', NULL, NULL, NULL, 3),
(15, '$2b$10$.Rjo5cEGDwYbumf0Uwk39.Asdacg6ZwRXtOJoXfMNIUl8Eh4sDU2W', 'Lerenard', 'Axellee', '0102030405', 'axelle.lerenard@gmail.com', '10 passage de la mer', '2004-12-24', '2025-03-23', NULL, NULL, NULL, 3),
(16, '$2b$10$rDwz7nJhrdhD7ZP7zgf6ju7GMXG67a//VHtQSLQx01btocnr2idn2', 'Turlututu', 'Dorian', '0102030405', 'turlututu.dorian@gmail.com', '10 passage de la mer', '2006-10-23', '2025-03-23', NULL, NULL, NULL, 3),
(17, '$2b$10$ubsXP3tlM5iK/M4wvvIZCedWM3Shx0kiWBM7/n.RPg32RYg8gNwci', 'Yannis', 'Camelin', '0102030405', 'yannis.camelin@gmail.com', '10 passage de la mer', '2004-12-12', '2025-03-23', NULL, NULL, NULL, 3);

-- --------------------------------------------------------

--
-- Structure de la table `ecole`
--

CREATE TABLE `ecole` (
  `id_ecole` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `date_ajout` date DEFAULT curdate(),
  `phone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ecole`
--

INSERT INTO `ecole` (`id_ecole`, `nom`, `adresse`, `email`, `date_ajout`, `phone`) VALUES
(1, 'Stych12', '10 passage de la mer', 'stych@gmail.com', '2025-03-18', '01 02 03 04 05'),
(2, 'Ornikar', '10 passage de la mer', 'ornikar@gmail.com', '2025-03-18', '01 02 03 04 05'),
(3, 'EnVoitureSimonee', '10 passage de la mer', 'envoituresimone@gmail.com', '2025-03-18', '01 02 03 04 05');

-- --------------------------------------------------------

--
-- Structure de la table `exam`
--

CREATE TABLE `exam` (
  `id_exam` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `id_ecole` int(11) NOT NULL,
  `id_candid` int(11) DEFAULT NULL,
  `score` int(11) NOT NULL,
  `appreciation` varchar(255) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `exam`
--

INSERT INTO `exam` (`id_exam`, `type`, `id_ecole`, `id_candid`, `score`, `appreciation`, `date`) VALUES
(1, 'Exam Blanc', 1, 1, 36, 'bien bien', '2025-03-08'),
(6, 'Exam Blanc', 1, 1, 40, 'Parfait bgette', '2025-03-21'),
(12, 'Exam Blanc', 1, 7, 20, 'ververveveve', '2025-02-25'),
(14, 'Entrainement', 1, 1, 20, 'cczzecz', '2025-03-07'),
(15, 'Entrainement', 1, 1, 25, 'vzvzvz', '2020-02-05'),
(17, 'Entrainement', 1, 1, 25, 'ververveveve', '2025-03-21'),
(18, 'Entrainement', 1, 1, 24, 'ververveveve', '2025-03-21'),
(19, 'Exam Blanc', 1, 1, 24, 'ververveveve', '2025-03-18'),
(20, 'Entrainement', 1, 1, 5, 'ververveveve', '2025-02-27'),
(22, 'Exam Blanc', 1, 1, 5, 'ververveveve', '2025-03-12');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Index pour la table `avis`
--
ALTER TABLE `avis`
  ADD PRIMARY KEY (`id_avis`),
  ADD KEY `id_ecole` (`id_ecole`),
  ADD KEY `id_candid` (`id_candid`);

--
-- Index pour la table `candidat`
--
ALTER TABLE `candidat`
  ADD PRIMARY KEY (`id_candid`),
  ADD KEY `id_ecole` (`id_ecole`);

--
-- Index pour la table `ecole`
--
ALTER TABLE `ecole`
  ADD PRIMARY KEY (`id_ecole`);

--
-- Index pour la table `exam`
--
ALTER TABLE `exam`
  ADD PRIMARY KEY (`id_exam`),
  ADD KEY `id_ecole` (`id_ecole`),
  ADD KEY `id_candid` (`id_candid`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `avis`
--
ALTER TABLE `avis`
  MODIFY `id_avis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `candidat`
--
ALTER TABLE `candidat`
  MODIFY `id_candid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `ecole`
--
ALTER TABLE `ecole`
  MODIFY `id_ecole` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `exam`
--
ALTER TABLE `exam`
  MODIFY `id_exam` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `avis`
--
ALTER TABLE `avis`
  ADD CONSTRAINT `avis_ibfk_1` FOREIGN KEY (`id_ecole`) REFERENCES `ecole` (`id_ecole`),
  ADD CONSTRAINT `avis_ibfk_2` FOREIGN KEY (`id_candid`) REFERENCES `candidat` (`id_candid`);

--
-- Contraintes pour la table `candidat`
--
ALTER TABLE `candidat`
  ADD CONSTRAINT `candidat_ibfk_1` FOREIGN KEY (`id_ecole`) REFERENCES `ecole` (`id_ecole`);

--
-- Contraintes pour la table `exam`
--
ALTER TABLE `exam`
  ADD CONSTRAINT `exam_ibfk_1` FOREIGN KEY (`id_ecole`) REFERENCES `ecole` (`id_ecole`),
  ADD CONSTRAINT `exam_ibfk_2` FOREIGN KEY (`id_candid`) REFERENCES `candidat` (`id_candid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
