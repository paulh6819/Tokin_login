     WITH updated AS (
        UPDATE users
        SET token_count = 10,
            token_count_down_period = NULL
        WHERE username = 'bob' AND token_count < 10 AND 
              token_count_down_period IS NOT NULL AND
              token_count_down_period < NOW() - INTERVAL '1 minute'
        RETURNing token_count, token_count_down_period
      )
      SELECT * FROM updated
      UNION ALL
      SELECT token_count, token_count_down_period FROM users WHERE username = 'bob' AND NOT EXISTS (SELECT 1 FROM updated)