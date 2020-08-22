create table if not exists user (
    user_id int not null auto_increment primary key,
    spotify_id varchar(128) not null
);

create table if not exists preset (
    preset_id int not null auto_increment primary key,
    user_id int not null,
    preset_name varchar(128) not null,
    repeat_limit int not null,
    foreign key (user_id) REFERENCES user(user_id)
);

create table if not exists playlist (
    playlist_id int not null auto_increment primary key,
    preset_id int not null,
    playlist_name varchar(128),
    spotify_uri varchar(128),
    num_tracks int,
    `order` boolean,
    weight int,
    foreign key (preset_id) REFERENCES preset(preset_id)
);

create table if not exists recent_tracks (
    rt_id int not null auto_increment primary key,
    preset_id int not null,
    track_uri varchar(128),
    foreign key (preset_id) REFERENCES preset(preset_id)
);

insert into user(spotify_id)
values('xergg');
