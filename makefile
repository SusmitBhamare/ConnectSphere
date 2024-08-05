# Define variables
USER_SERVICE_DIR=user
MESSAGE_SERVICE_DIR=message
WORKSPACE_SERVICE_DIR=workspace
DOCKER_COMPOSE_FILE=docker-compose.yaml

# Platform-specific commands
ifeq ($(OS), Windows_NT)
	ECHO := @echo
	RM := del /Q
	MVN_CMD := mvnw.cmd
	DOCKER_COMPOSE_CMD := docker-compose
	START_CMD := start
else
	ECHO := @echo
	RM := rm -f
	MVN_CMD := ./mvnw
	DOCKER_COMPOSE_CMD := docker-compose
	START_CMD := nohup
endif

# Targets
.PHONY: all compose start-user start-message start-workspace stop-user stop-message stop-workspace clean

# Run Docker Compose before starting services
compose:
	$(ECHO) Running Docker Compose...
	@if exist $(DOCKER_COMPOSE_FILE) ( \
		$(DOCKER_COMPOSE_CMD) -f $(DOCKER_COMPOSE_FILE) up -d \
	) else ( \
		$(ECHO) $(DOCKER_COMPOSE_FILE) not found! \
	)

all: compose start-user start-message start-workspace

start-user:
	$(ECHO) Starting User Service...
	@if exist $(USER_SERVICE_DIR) ( \
		cd $(USER_SERVICE_DIR) && $(START_CMD) cmd /c $(MVN_CMD) spring-boot:run \
	) else ( \
		$(ECHO) $(USER_SERVICE_DIR) directory not found! \
	)

start-message:
	$(ECHO) Starting Message Service...
	@if exist $(MESSAGE_SERVICE_DIR) ( \
		cd $(MESSAGE_SERVICE_DIR) && $(START_CMD) cmd /c $(MVN_CMD) spring-boot:run \
	) else ( \
		$(ECHO) $(MESSAGE_SERVICE_DIR) directory not found! \
	)

start-workspace:
	$(ECHO) Starting Workspace Service...
	@if exist $(WORKSPACE_SERVICE_DIR) ( \
		cd $(WORKSPACE_SERVICE_DIR) && $(START_CMD) cmd /c $(MVN_CMD) spring-boot:run \
	) else ( \
		$(ECHO) $(WORKSPACE_SERVICE_DIR) directory not found! \
	)

stop-user:
	$(ECHO) Stopping User Service...
	# Provide a mechanism to stop the service.

stop-message:
	$(ECHO) Stopping Message Service...
	# Provide a mechanism to stop the service.

stop-workspace:
	$(ECHO) Stopping Workspace Service...
	# Provide a mechanism to stop the service.

clean:
	$(ECHO) Cleaning up...
	@if exist $(USER_SERVICE_DIR) ( \
		cd $(USER_SERVICE_DIR) && $(MVN_CMD) clean \
	)
	@if exist $(MESSAGE_SERVICE_DIR) ( \
		cd $(MESSAGE_SERVICE_DIR) && $(MVN_CMD) clean \
	)
	@if exist $(WORKSPACE_SERVICE_DIR) ( \
		cd $(WORKSPACE_SERVICE_DIR) && $(MVN_CMD) clean \
	)
