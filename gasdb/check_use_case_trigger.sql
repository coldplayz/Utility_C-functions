-- create a trigger

DROP TRIGGER IF EXISTS check_valid_use;

DELIMITER //

CREATE TRIGGER check_valid_use
	BEFORE INSERT
	ON usage_refill_1
	FOR EACH ROW
		BEGIN
			DECLARE useCase VARCHAR(255);
			SELECT use_case INTO useCase
				FROM use_cases
				WHERE use_cases.use_case = NEW.use_case;
			IF useCase is NULL
				THEN
				-- unregistered use case; prompt trigger failure
				SET NEW.use_case = 'UnrecognizedUseCase' + NEW.use_case;
			END IF;
		END; //

DELIMITER ;
