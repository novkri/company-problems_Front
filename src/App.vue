<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
  import MainLayout from '@/layouts/MainLayout'
  import NoneLayout from '@/layouts/NoneLayout'

  export default {
    components: {
      MainLayout,
      NoneLayout
    },
    computed: {
      layout() {
        return (this.$route.meta.layout) + '-layout';
      }
    },
  }
</script>
<style lang="scss">
  .container__groups_list {
    max-height: 393px;
    min-height: 393px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
  }

  .groups_list {
    font-family: 'GothamPro';
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
    padding-left: 20px;
    padding-right: 20px;
  }

  button {
    text-decoration: none !important;
  }

  .close-popover {
    display: flex;
    justify-content: flex-end;
    font-size: 28px;
    font-family: 'GothamPro';
    cursor: pointer;
    color: #000;
  }

  .close-popover:hover {
    text-decoration: none;
    color: #000;
  }

  .spinner-border {
    margin: auto;
    color: #92D2C3;
  }

  .yes {
    background-color: #4EAD96 !important;
    color: #fff !important;
  }

  .form-control.input {
    border-radius: 0 10px 10px 0 !important;
    background-color: transparent;
  }

  .tooltip {
    display: block !important;
    z-index: 10000;

    width: 260px;
    height: 270px;
    max-width: 260px;
    max-height: 270px;

    .tooltip-inner {
      background: #fff;
      color: #4f4f4f;
      border-radius: 16px;
      padding: 5px 10px 4px;
      box-shadow: 0 5px 30px rgba(black, .1);
    }


    &[x-placement^="top"] {
      margin-bottom: 5px;

      .tooltip-arrow {
        border-width: 5px 5px 0 5px;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        bottom: -5px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    &[x-placement^="bottom"] {
      margin-top: 5px;

      .tooltip-arrow {
        border-width: 0 5px 5px 5px;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-top-color: transparent !important;
        top: -5px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    &[x-placement^="right"] {
      margin-left: 5px;

      .tooltip-arrow {
        border-width: 5px 5px 5px 0;
        border-left-color: transparent !important;
        border-top-color: transparent !important;
        border-bottom-color: transparent !important;
        left: -5px;
        top: calc(50% - 5px);
        margin-left: 0;
        margin-right: 0;
      }
    }

    &[x-placement^="left"] {
      margin-right: 5px;

      .tooltip-arrow {
        border-width: 5px 0 5px 5px;
        border-top-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        right: -5px;
        top: calc(50% - 5px);
        margin-left: 0;
        margin-right: 0;
      }
    }

    &.popover {
      $color: #f9f9f9;
      border: none;
      outline: none;

      .popover-inner {
        overflow-x: hidden;
        overflow-y: scroll;
        border: none;
        background: $color;
        color: black;
        padding: 16px;
        border-radius: 5px;
        box-shadow: 0 5px 30px rgba(black, .1);
        width: 460px;
        height: 270px;
        max-width: 460px;
        max-height: 270px;

        div {
          display: flex;
        }
      }

      .popover-arrow {
        border-color: $color;
      }
    }

    &[aria-hidden='true'] {
      visibility: hidden;
      opacity: 0;
      transition: opacity .15s, visibility .15s;
      border: none;
      outline: none;
    }

    &[aria-hidden='false'],
    &[aria-hidden='false']:focus {
      border: none;
      outline: none;
      visibility: visible;
      opacity: 1;
      transition: opacity .15s;
    }
  }

  * {
    letter-spacing: 0.15px;
  }

  @media (max-width: 1500px) {

    *,
    span,
    textarea,
    input {
      font-size: 13px;
    }

    span,
    textarea,
    input {
      font-size: 13px;
    }

    .close {
      font-size: 20px !important;

      span {
        font-size: 20px !important;
      }
    }
  }
</style>