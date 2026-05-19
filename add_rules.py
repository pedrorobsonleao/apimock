import json

def add_mockoon_rules():
    with open('mockoon-environment.json', 'r') as f:
        data = json.load(f)
        
    for route in data['routes']:
        if route['endpoint'] == '/login':
            for response in route['responses']:
                if response['statusCode'] == 401:
                    # Regra para senha inválida (ou não bater com admin/password123)
                    response['rules'] = [
                        {
                            "target": "body",
                            "modifier": "password",
                            "value": "^(?!password123$).*$",
                            "invert": False,
                            "operator": "regex"
                        }
                    ]
                elif response.get('label') == 'Login Success':
                    # Add default flag to success?
                    # Mockoon matches from top to bottom. If rules match, it returns.
                    # Otherwise, it falls back to the default or first.
                    response['rules'] = [
                         {
                            "target": "body",
                            "modifier": "username",
                            "value": "admin",
                            "invert": False,
                            "operator": "equals"
                        },
                        {
                            "target": "body",
                            "modifier": "password",
                            "value": "password123",
                            "invert": False,
                            "operator": "equals"
                        }
                    ]
                    
            # Let's add the 400 error response for empty username
            route['responses'].append({
                "uuid": "response-login-bad-request",
                "body": "{\n  \"error\": \"Bad Request\",\n  \"message\": \"Username e password são obrigatórios\"\n}",
                "latency": 0,
                "statusCode": 400,
                "label": "Bad Request",
                "headers": [
                  {
                    "key": "Content-Type",
                    "value": "application/json"
                  }
                ],
                "bodyType": "INLINE",
                "rules": [
                  {
                    "target": "body",
                    "modifier": "username",
                    "value": "^$",
                    "invert": False,
                    "operator": "regex"
                  }
                ]
            })

        elif route['endpoint'] == '/pessoa':
            if route['method'] == 'get':
                for response in route['responses']:
                    if response['statusCode'] == 403:
                        response['rules'] = [
                            {
                                "target": "header",
                                "modifier": "Authorization",
                                "value": "",
                                "invert": False,
                                "operator": "null"
                            }
                        ]
            elif route['method'] == 'post':
                for response in route['responses']:
                    if response['statusCode'] == 400:
                        response['rules'] = [
                            {
                                "target": "body",
                                "modifier": "nome",
                                "value": "^.{0,2}$",
                                "invert": False,
                                "operator": "regex"
                            }
                        ]

        elif route['endpoint'] == '/pessoa/:id':
            for response in route['responses']:
                if response['statusCode'] == 404:
                    response['rules'] = [
                        {
                            "target": "params",
                            "modifier": "id",
                            "value": "999",
                            "invert": False,
                            "operator": "equals"
                        }
                    ]
                    
    # To make sure Mockoon evaluates default correctly, 
    # Mockoon returns the first response that matches the rules, or the default response if none match.
    # We should set the success response as default (no rules needed, or set default flag if any).
    # Wait, in Mockoon, if a response has NO rules, it's considered the default ONLY IF the default flag is true or if no other rules match.
    # Actually, Mockoon just checks responses from top to bottom. If a response has rules and they match, it's used.
    # If a response has NO rules, it's a fallback.
    # So we should reorder responses: specific rule-based responses first, fallback (no rules) last.
    
    for route in data['routes']:
        # Sort responses: those with rules first, then those without.
        route['responses'].sort(key=lambda r: len(r.get('rules', [])), reverse=True)

    with open('mockoon-environment.json', 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    add_mockoon_rules()
