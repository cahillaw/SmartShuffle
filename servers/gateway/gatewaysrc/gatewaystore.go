package gatewaysrc

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql" //needed
)

//SQLStore holds db info
type SQLStore struct {
	DB *sql.DB
}

//GetUserInfo checks if the user is in the db, and if they are, returns the user info, otherwise creates the user in the databases
func (sqls *SQLStore) GetUserInfo(spotifyid string) (*User, error) {
	user := &User{}
	insq := "select user_id, spotify_id from user where spotify_id = ?"

	errQuery := sqls.DB.QueryRow(insq, spotifyid).Scan(&user.UserID, &user.SpotifyID)
	if errQuery != nil {
		if errQuery == sql.ErrNoRows {
			insq = "insert into user(spotify_id) values(?)"

			res, errExec := sqls.DB.Exec(insq, spotifyid)
			if errExec != nil {
				return nil, errExec
			}

			id, idErr := res.LastInsertId()
			if idErr != nil {
				return nil, idErr
			}
			user.UserID = int(id)
			user.SpotifyID = spotifyid

			return user, nil
		}
		return nil, errQuery
	}

	return user, nil
}
