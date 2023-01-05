create table user(
id INTEGER primary key AUTOINCREMENT,
name varchar(150),
user_name varchar(150) unique,
type varchar(20)
);

CREATE TABLE questions (
	id	INTEGER primary key AUTOINCREMENT,
	question	varchar(550),
	topic	varchar(150),
	options	TEXT,
	correct_option	TEXT,
	time_in_minutes	INTEGER
);

create table answer(
id INTEGER primary key AUTOINCREMENT,
user_id int,
question_id int,
selected_topic varchar(150),
selected_option json,
is_correct bool
);

CREATE TABLE "answer" (
	"id"	INTEGER,
	"user_id"	int,
	"question_id"	int,
	"selected_topic"	varchar(150),
	"selected_option"	varchar(30),
	"reference"	varchar(30),
	"is_correct"	bool,
	PRIMARY KEY("id" AUTOINCREMENT)


      <nz-cascader id="nzCascader" name="nzCascader" [nzOptions]="nzParcelAreaLst"
                [(ngModel)]="nzParcelAreaLstSelected" [nzShowSearch]="true" [nzPlaceHolder]="'Choose Area'"
                (ngModelChange)="onNzParcelAreaChanges($event)" [nzNotFoundContent]="'No area available!'">
              </nz-cascader>