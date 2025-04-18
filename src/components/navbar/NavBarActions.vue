<template>
    <div>
        <ProfileDropdown :avatar-name="avatarName"></ProfileDropdown>
    </div>
</template>

<script setup>
import NotificationDropdown from './dropdowns/NotificationDropdown.vue';
import ProfileDropdown from './dropdowns/ProfileDropdown.vue';
defineProps({
    avatarName: {
        type: String
    }
})

</script>