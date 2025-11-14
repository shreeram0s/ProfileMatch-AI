import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer

class AnalysisConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f'analysis_{self.session_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Send initial connection message
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to analysis updates'
        }))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

        if message_type == 'ping':
            await self.send(text_data=json.dumps({
                'type': 'pong',
                'message': 'Server is alive'
            }))

    # Receive message from room group
    async def analysis_update(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'analysis_update',
            'stage': event['stage'],
            'progress': event['progress'],
            'message': event['message'],
            'data': event.get('data', {})
        }))

    async def analysis_complete(self, event):
        # Send completion message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'analysis_complete',
            'message': event['message'],
            'results': event['results']
        }))

    async def analysis_error(self, event):
        # Send error message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'analysis_error',
            'message': event['message'],
            'error': event.get('error', '')
        }))
