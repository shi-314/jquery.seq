jquery.seq
==========

A javascript / node / mongodb sequence diagram editor :)

/save
=====


Input: Sequence data

Output: Sequence ID

Example Input
```json
		{
			"email": "user@example.com",
			"name": "My first sequence diagram",
			"elements": { },
			"connections": { }
		}
```

Example Output

```json
		{
			"_id": "asd65asd64as65d4a6s54dasd87875"
		}
```

Error: Errors may occur when your sequence data is incomplete
