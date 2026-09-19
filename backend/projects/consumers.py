from channels.generic.websocket import AsyncJsonWebsocketConsumer
class ProjectUpdatesConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if not user.is_authenticated: await self.close(); return
        self.group = 'project_updates_admin' if user.is_staff else f'project_updates_{user.id}'
        await self.channel_layer.group_add(self.group, self.channel_name); await self.accept()
    async def disconnect(self, code): await self.channel_layer.group_discard(self.group, self.channel_name)
    async def project_update(self, event): await self.send_json(event['payload'])
