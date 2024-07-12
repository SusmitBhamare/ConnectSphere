CREATE TABLE "user"
(
    id       UUID NOT NULL,
    name     VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    email    VARCHAR(255),
    image    VARCHAR(255),
    role     SMALLINT,
    CONSTRAINT pk_user PRIMARY KEY (id)
);

CREATE TABLE user_messages_received
(
    user_id           UUID NOT NULL,
    messages_received UUID
);

CREATE TABLE user_messages_sent
(
    user_id       UUID NOT NULL,
    messages_sent UUID
);

CREATE TABLE user_workspaces
(
    user_id    UUID NOT NULL,
    workspaces UUID
);

ALTER TABLE "user"
    ADD CONSTRAINT uc_a207721d4377033c99a4161e6 UNIQUE (username);

ALTER TABLE user_messages_received
    ADD CONSTRAINT fk_user_messagesreceived_on_user FOREIGN KEY (user_id) REFERENCES "user" (id);

ALTER TABLE user_messages_sent
    ADD CONSTRAINT fk_user_messagessent_on_user FOREIGN KEY (user_id) REFERENCES "user" (id);

ALTER TABLE user_workspaces
    ADD CONSTRAINT fk_user_workspaces_on_user FOREIGN KEY (user_id) REFERENCES "user" (id);