create database if not exists lost_found_db;
use lost_found_db;

create table if not exists report (
	id INT primary key auto_increment,
	title VARCHAR(255) not null,
	description TEXT not null,
	category ENUM('Lost', 'Found') not null,
	location VARCHAR(255) not null,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    status ENUM('Active', 'Claimed') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
drop table report;

create table if not exists member (
	id INT primary key auto_increment,
	name VARCHAR(255) not null,
    qiu_email VARCHAR(100),
    contact VARCHAR(20),
    password VARCHAR(30)
);
drop table member;

INSERT INTO report (title, description, category, location, contact_email, contact_phone, status) VALUES
('iPhone 13', 'Black iPhone 13 with blue case, lost near food court', 'Lost', 'TTS, La Place Cafe', 'johnsmith@qiu.edu.my', '+601123451241', 'Active'),
('Brown Wallet', 'Found brown leather wallet near bus station', 'Found', 'ASB L3 Exam Hall', 'sarahjohnson@qiu.edu.my', '+601545125789', 'Active'),
('House Keys', 'Set of 3 keys with silver keychain', 'Lost', 'Unknown', 'mikewilson@qiu.edu.my', '+60124568745', 'Active'),
('Laptop Bag', 'Black Dell laptop bag with charger', 'Found', 'TTS L2 Bookstore', 'emmadavis@qiu.edu.my', '+60146583312', 'Claimed'),
('Apple Pencil (2nd Gen)', 'White Apple Pencil with "Alex" engraved near bottom', 'Lost', 'Library Level 3, Study Pod 7', 'alexchen@qiu.edu.my', '+60123456789', 'Active'),
('Student ID Card', 'Student ID for TAN SRI AHMAD (ID: 24012345)', 'Found', 'Level 2 Bookstore', 'fatimah.rahman@qiu.edu.my', '+60187654321', 'Active'),
('Water Bottle', 'Stainless steel Hydro Flask, navy blue with stickers', 'Lost', 'ASB L1 CS LAB 3', 'navinraj@qiu.edu.my', '+60199887766', 'Active'),
('Scientific Calculator', 'Casio fx-570EX, name "Wei Jie" on back', 'Found', 'ASB L2, LR6', 'weijie.ng@qiu.edu.my', '+60123234567', 'Claimed'),
('Power Bank', 'Xiaomi 20000mAh power bank with black cable', 'Lost', 'TTS L1', 'limpeishi@qiu.edu.my', '+60166554433', 'Active'),
('Prescription Glasses', 'Black frame glasses, -2.50 prescription', 'Found', 'Bus Stop, on bench', 'dr.kumar@qiu.edu.my', '+60123457890', 'Active');
select *from report;

INSERT INTO member (name, qiu_email, contact, password) VALUES
('John Smith', 'johnsmith@qiu.edu.my', '+601123451241', 'John@123');

INSERT INTO member (name, qiu_email, contact, password) VALUES
('Vince Voon', 'vincevoon@qiu.edu.my', '+601111313301', 'Vince@123');
select *from member;