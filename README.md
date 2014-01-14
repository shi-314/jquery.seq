jquery.seq
==========

A javascript / node / expressjs / mongodb sequence diagram editor :)

/v1/save
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

/v1/list/:email
=====

Input: E mail address

Output: Array of sequence objects

Example Input: http://localhost:8080/v1/list/test@example.com

Example Output

```json
		[
  {
    "email": "test@example.com",
    "name": "My first sequence",
    "elements": [
      {
        "idx": "0",
        "label": "Start",
        "position": {
          "x": "200",
          "y": "200.5"
        }
      },
      {
        "idx": "1",
        "label": "End",
        "position": {
          "x": "600",
          "y": "200.5"
        }
      }
    ],
    "connections": [
      {
        "element1": "0",
        "element2": "1",
        "element1Anchor": "right",
        "element2Anchor": "left"
      }
    ],
    "_id": "52d5b8764ee951cc1af45923"
  }
]
```

Error: If you miss the e mail parameter
