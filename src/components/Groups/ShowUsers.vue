<template>
<div class="containerUsers">
    <ul>
      <li>
              <div class="member">
        <div class="member-icon">
          <award-icon size="1.5x" class="custom-class"></award-icon>
        </div>
        1. {{leader.surname}} {{leader.name[0]}}.
      </div>
      <div class="close">
        <button type="button" id="close" class="close" data-dismiss="modal" style="font-size: 24px;"
          @click="removeUserFromGroup(member.id, group.id)">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      </li>

                       
    <li v-for="(member, idx) in members" :key="idx">
      <div class="member">
        <div class="member-icon">
          <user-icon size="1.5x" class="custom-class" id="iconUser"></user-icon>
        </div>
        {{idx+2}}. {{member.surname}} {{member.name[0]}}.
        <!-- {{member.father_name ? member.father_name[0]+'.' : ''}} -->
      </div>
      <div class="close">
        <button type="button" id="close" class="close" data-dismiss="modal" style="font-size: 24px;"
          @click="removeUserFromGroup(member.id, group.id)">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </li>
  </ul>
</div>

</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    // TrashIcon,
    // PlusIcon,
    // ChevronUpIcon,
    UserIcon,
    // ChevronDownIcon,
    AwardIcon,
    // CheckIcon,

    // ChevronRightIcon,
    // ChevronLeftIcon
  } from 'vue-feather-icons'

  export default {
    name: 'members',
    props: ['val'],
    components: {
      UserIcon,
      AwardIcon,
    },
    computed: {
      ...mapGetters(['error', 'error404', 'members', 'usersNoGroup', 'leader'])
    },

    async mounted() {
      console.log('m');
      await this.$store.dispatch('getMembers', this.val)
      await this.$store.dispatch('getLeader', this.val)
    },

  }
</script>

<style lang="scss" scoped>
  .containerUsers {
    display: flex;
    flex-direction: column;
    margin: 0;
  }
  
  ul {
    padding: 0;
    list-style: none;
    padding-right: 24px;

    font-family: 'GothamPro';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
  }

  li {
    display: flex;
    width: 100%;
    justify-content: space-between;

    padding: 30px 24px;
    border-bottom: 1px solid #DEDEDE;
  }
  li:last-child {
    border: none;
    padding-bottom: 20px;
  }

  .member {
    display: flex;
    align-items: center;

    .member-icon {
      padding-right: 10px;
    }
  }
</style>>