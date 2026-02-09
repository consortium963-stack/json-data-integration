import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления видео-отзывами клиентов"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database connection not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            cursor.execute('''
                SELECT id, client_name, description, video_url, video_type, sort_order
                FROM video_testimonials
                ORDER BY sort_order ASC
            ''')
            testimonials = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps([dict(row) for row in testimonials]),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            client_name = body.get('clientName', '')
            description = body.get('description', '')
            video_url = body.get('videoUrl', '')
            video_type = body.get('videoType', 'upload')
            sort_order = body.get('sortOrder', 999)
            
            cursor.execute('''
                INSERT INTO video_testimonials 
                (client_name, description, video_url, video_type, sort_order)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, client_name, description, video_url, video_type, sort_order
            ''', (client_name, description, video_url, video_type, sort_order))
            
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(dict(result)),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            testimonial_id = body.get('id')
            client_name = body.get('clientName', '')
            description = body.get('description', '')
            video_url = body.get('videoUrl', '')
            video_type = body.get('videoType', 'upload')
            
            if not testimonial_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'ID is required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('''
                UPDATE video_testimonials 
                SET client_name = %s, description = %s, video_url = %s, 
                    video_type = %s, updated_at = NOW()
                WHERE id = %s
                RETURNING id, client_name, description, video_url, video_type, sort_order
            ''', (client_name, description, video_url, video_type, testimonial_id))
            
            result = cursor.fetchone()
            conn.commit()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Testimonial not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(dict(result)),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            testimonial_id = params.get('id')
            
            if not testimonial_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'ID is required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('DELETE FROM video_testimonials WHERE id = %s', (testimonial_id,))
            conn.commit()
            
            return {
                'statusCode': 204,
                'headers': {
                    'Access-Control-Allow-Origin': '*'
                },
                'body': '',
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
