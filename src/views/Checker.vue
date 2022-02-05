<script>
import infoIcon from '@/assets/icons/info.svg?url';
import closeIcon from '@/assets/icons/close.svg?url';

const minmax = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

// duration in seconds to human readable (german)
const humanizeDuration = (duration) => {
  duration = Math.floor(duration);
  if (duration < 1) {
    return null;
  }

  const units = [
    {
      plural: 'Sekunden',
      singular: 'Sekunde',
      max: 60,
    },
    {
      plural: 'Minuten',
      singular: 'Minute',
      max: 60,
    },
    {
      plural: 'Stunden',
      singular: 'Stunde',
      max: 24,
    },
    {
      plural: 'Tagen',
      singular: 'Tag',
      max: 30.41,
    },
    {
      plural: 'Monaten',
      singular: 'Monat',
      max: 12,
    },
    {
      plural: 'Jahren',
      singular: 'Jahr',
      max: 1000000,
    },
    {
      plural: 'Millionen Jahren',
      singular: 'Millionen Jahre',
      max: 1000,
    },
    {
      plural: 'Milliarde Jahren',
      singular: 'Milliarde Jahre',
      max: 1000,
    },
    {
      plural: 'Billionen Jahren',
      singular: 'Billionen Jahre',
      max: 1000,
    },
    {
      plural: 'Billiarde Jahren',
      singular: 'Billiarde Jahre',
      max: 1000,
    },
    {
      plural: 'Trillionen Jahren',
      singular: 'Trillionen Jahre',
      max: 1000,
    },
    {
      plural: 'Trilliarden Jahren',
      singular: 'Trilliarden Jahre',
      max: 1000,
    },
    {
      plural: 'Quadrillionen Jahren',
      singular: 'Quadrillionen Jahre',
      max: 1000,
    },
    {
      plural: 'Quadrilliarden Jahren',
      singular: 'Quadrilliarden Jahre',
      max: 1000,
    },
    {
      plural: 'Quintillionen Jahren',
      singular: 'Quintillionen Jahre',
      max: 1000,
    },
    {
      plural: 'Quintilliarden Jahren',
      singular: 'Quintilliarden Jahre',
    },
  ];

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    if (unit.max === undefined || duration < unit.max) {
      return `${duration.toLocaleString('fullwide')} ${
        duration === 1 ? unit.singular ?? unit.plural : unit.plural
      }`;
    }
    duration = Math.floor(duration / unit.max);
  }
};

export default {
  data: () => ({
    password: '',
    options: {
      length: 0,
      charGroups: [
        {
          id: 1,
          label: 'Kleinbuchstaben',
          active: false,
          chars: 'abcdefghijklmnopqrstuvwxyz',
          defaultChars: 'abcdefghijklmnopqrstuvwxyz',
        },
        {
          id: 2,
          label: 'Großbuchstaben',
          active: false,
          chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          defaultChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        },
        {
          id: 3,
          label: 'Ziffern',
          active: false,
          chars: '0123456789',
          defaultChars: '0123456789',
        },
        {
          id: 4,
          label: 'Sonderzeichen',
          active: false,
          chars: '§$%&?+#!',
          defaultChars: '§$%&?+#!',
        },
      ],
    },
    safetyLevels: [
      {
        level: 1,
        color: '#e74c3c',
      },
      {
        level: 2,
        color: '#e74c3c',
        minCrackingTime: 1,
      },
      {
        level: 3,
        color: '#f39c12',
        minCrackingTime: 3600, // 1h
      },
      {
        level: 4,
        color: '#f39c12',
        minCrackingTime: 86400, // 1d
      },
      {
        level: 5,
        color: '#2ecc71',
        minCrackingTime: 31536000, // 1y
      },
      {
        level: 6,
        color: '#2ecc71',
        minCrackingTime: 31536000000, // 1000y
      },
    ],
    infoIcon,
    closeIcon,
    crackingKeysPerSecond: 2100000000, // 2,1 Milliarden Keys/s (Stand 2011)
    showCrackingTime: true,
    modal: false,
    modalCharGroupId: 1,
  }),
  methods: {
    humanizeDuration(duration) {
      return humanizeDuration(duration)
        .replace('Tagen', 'Tage')
        .replace('Monaten', 'Monate')
        .replace('Jahren', 'Jahre');
    },
  },
  mounted() {
    if (this.$refs.passwordField) {
      this.$refs.passwordField.focus();
    }
  },
  watch: {
    password(newPassword) {
      // Analyze pasword and set length and active charGroups (+ add chars, which are not included by default)

      this.options.length = newPassword.length;

      // Reset
      this.options.charGroups.forEach((charGroup) => {
        charGroup.active = false;
        charGroup.chars = charGroup.defaultChars;
      });

      const activateAndExtendCharGroup = (id, char) => {
        const currentCharGroup = this.options.charGroups.find(
          (charGroup) => charGroup.id === id
        );
        currentCharGroup.active = true;
        if (!currentCharGroup.chars.includes(char)) {
          currentCharGroup.chars += char;
        }
      };

      for (let i = 0; i < newPassword.length; i++) {
        const char = newPassword.charAt(i);
        if (/^[0-9]$/.test(char)) {
          activateAndExtendCharGroup(3, char);
        } else {
          if (char === char.toLowerCase() && char === char.toUpperCase()) {
            activateAndExtendCharGroup(4, char);
          } else {
            if (char === char.toLowerCase()) {
              activateAndExtendCharGroup(1, char);
            }
            if (char === char.toUpperCase()) {
              activateAndExtendCharGroup(2, char);
            }
          }
        }
      }
    },
  },
  computed: {
    possibleCombinations() {
      const passwordLength = this.options.length;
      const activeCharGroups = this.options.charGroups.filter(
        (charGroup) => charGroup.active
      );
      const charsetLength = activeCharGroups.reduce(
        (length, charGroup) => (length += charGroup.chars.length),
        0
      );

      return Math.pow(charsetLength, passwordLength);
    },
    crackingTime() {
      return this.possibleCombinations / this.crackingKeysPerSecond;
    },
    humanizedCrackingTime() {
      return humanizeDuration(this.crackingTime);
    },
    safetyLevel() {
      for (let i = this.safetyLevels.length - 1; i >= 0; i--) {
        const level = this.safetyLevels[i];
        if (
          level.minCrackingTime === undefined ||
          this.crackingTime >= level.minCrackingTime
        ) {
          return level;
        }
      }
    },
    modalCharGroup() {
      return this.options.charGroups.find(({ id }) => {
        return id === this.modalCharGroupId;
      });
    },
  },
};
</script>

<template>
  <article class="checker">
    <section class="headline">
      <h1>
        <span>Passwort</span>
        <span>Prüfer</span>
      </h1>
    </section>

    <div class="content">
      <section class="fieldarea">
        <div
          class="field"
          :class="{ filled: password.length }"
          contenteditable="true"
          @input="password = $event.target.innerText"
          ref="passwordField"
        />
      </section>

      <section class="safetyLevel">
        <div class="wrapper" @click="modal = 'safetyLevelsModal'">
          <p class="level">
            Sicherheitslevel
            <span
              class="number"
              :style="{ backgroundColor: safetyLevel.color }"
              >{{ safetyLevel.level }}</span
            >
          </p>
          <p class="small">
            {{
              showCrackingTime
                ? humanizedCrackingTime === null
                  ? 'sofort knackbar'
                  : `knackbar in ${humanizedCrackingTime}`
                : `${possibleCombinations.toLocaleString(
                    'fullwide'
                  )} Kombinationsmöglichkeiten`
            }}
          </p>
        </div>
      </section>

      <section class="options">
        <div class="wrapper">
          <label class="option input-option" for="length">
            <input
              type="number"
              name="length"
              id="length"
              size="2"
              disabled
              v-model="options.length"
            />
            <p class="label">Passwortlänge</p>
          </label>
          <label
            class="option"
            :for="charGroup.name"
            v-for="charGroup in options.charGroups"
            :key="charGroup.name"
          >
            <input
              type="checkbox"
              :name="charGroup.name"
              :id="charGroup.name"
              :checked="charGroup.active"
              disabled
            />
            <p class="label">{{ charGroup.label }}</p>
            <img
              :src="infoIcon"
              class="icon edit"
              @click.stop="
                () => {
                  modal = 'charGroupModal';
                  modalCharGroupId = charGroup.id;
                }
              "
            />
          </label>
        </div>
      </section>
    </div>
  </article>

  <div id="backdrop" v-if="modal">
    <div
      class="modal"
      id="safetyLevelsModal"
      v-if="modal === 'safetyLevelsModal'"
    >
      <div class="closeBtn" @click="modal = false">
        <img :src="closeIcon" class="icon" />
      </div>

      <h3 class="title">Sicherheitslevel</h3>

      <div class="safetyLevelsWrapper">
        <table class="safetyLevels">
          <tr>
            <th>Level</th>
            <td class="level" v-for="level in safetyLevels" :key="level.level">
              <div class="card" :style="{ backgroundColor: level.color }">
                {{ level.level }}
              </div>
            </td>
          </tr>
          <tr>
            <th
              :class="{ modeSwitch: true, active: !showCrackingTime }"
              @click="showCrackingTime = false"
            >
              Mögliche Kombinationen
            </th>
            <td
              class="combinations"
              v-for="(level, index) in safetyLevels"
              :key="level.level"
            >
              {{
                level.minCrackingTime === undefined
                  ? `< ${(
                      safetyLevels[index + 1].minCrackingTime *
                      this.crackingKeysPerSecond
                    ).toLocaleString('fullwide')}`
                  : `≥ ${(
                      level.minCrackingTime * this.crackingKeysPerSecond
                    ).toLocaleString('fullwide')}`
              }}
            </td>
          </tr>
          <tr>
            <th
              :class="{ modeSwitch: true, active: showCrackingTime }"
              @click="showCrackingTime = true"
            >
              Zeit zum Knacken
            </th>
            <td
              class="crackingTime"
              v-for="(level, index) in safetyLevels"
              :key="level.level"
            >
              {{
                level.minCrackingTime === undefined
                  ? `< ${humanizeDuration(
                      safetyLevels[index + 1].minCrackingTime
                    )}`
                  : `≥ ${humanizeDuration(level.minCrackingTime)}`
              }}
            </td>
          </tr>
        </table>
      </div>

      <div class="setting">
        <p class="preheading">Berechnungsgrundlage</p>
        <div class="option">
          <div class="key">
            <p class="name">Brute-Force-Geschwindigkeit</p>
            <p class="unit">(Keys/s)</p>
          </div>
          <input
            type="number"
            name="crackingKeysPerSecond"
            id="crackingKeysPerSecond"
            class="value"
            v-model="crackingKeysPerSecond"
          />
        </div>
      </div>
    </div>

    <div class="modal" id="charGroupModal" v-if="modal === 'charGroupModal'">
      <div class="closeBtn" @click="modal = false">
        <img :src="closeIcon" class="icon" />
      </div>

      <h3 class="title">
        {{ modalCharGroup?.label }}
      </h3>

      <div class="settings">
        <div class="setting">
          <div class="option chars-option">
            <p class="key">Zeichen</p>
            <textarea
              type="text"
              name="chars"
              id="chars"
              class="value"
              disabled
              :value="modalCharGroup.chars"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#backdrop {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(#000000, 0.5);
  z-index: 9;

  .modal {
    position: relative;
    border-radius: 20px;
    background-color: #1f1f2c;
    box-shadow: 0 5px 30px rgba(#000000, 0.3);
    padding: 24px;
    max-width: 100%;
    max-width: calc(100% - 48px);
    box-sizing: border-box;

    .closeBtn {
      position: absolute;
      top: -12px;
      right: -12px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 35px;
      height: 35px;
      border-radius: 12px;
      background-color: #1f1f2c;
      box-shadow: 0 5px 20px rgba(#000000, 0.3);
      transition: all 80ms ease;
      cursor: pointer;

      .icon {
        opacity: 0.7;
        transition: opacity 80ms ease;
      }

      &:hover {
        .icon {
          opacity: 1;
        }

        top: -6px;
        right: -6px;
      }
    }

    .title {
      font-size: 24px;
      font-weight: 600;
      text-align: center;
      margin: 0 0 16px 0;
      outline: none;
    }

    &#safetyLevelsModal {
      .safetyLevelsWrapper {
        max-width: 100%;
        overflow: auto;
      }

      .safetyLevels {
        th {
          font-size: 18px;
          font-weight: 500;
          text-align: left;
          padding-right: 16px;
        }

        .level {
          padding: 0 4px;

          .card {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            min-height: 40px;
            font-size: 20px;
            font-weight: 700;
            text-align: center;
          }
        }

        .modeSwitch {
          color: rgba(#ffffff, 0.5);
          cursor: pointer;

          &.active {
            color: #ffffff;
          }
        }

        .combinations,
        .crackingTime {
          padding: 8px;
          text-align: center;
        }
      }

      .setting {
        margin: 32px 0 0 0;

        .preheading {
          font-size: 14px;
          font-weight: 600;
          color: rgba(#ffffff, 0.5);
          text-transform: uppercase;
        }

        .option {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;

          .key {
            .name {
              font-size: 18px;
              font-weight: 500;
              margin: 0 24px 0 0;
            }

            .unit {
              font-size: 12px;
              color: rgba(#ffffff, 0.5);
            }
          }

          .value {
            font-family: Poppins, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-size: 18px;
            font-weight: 600;
            outline: none;
            color: #ffffff;
            border: none;
            background-color: transparent;
          }
        }
      }
    }

    &#charGroupModal {
      .settings {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;

        .setting {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: stretch;
          margin: 0 0 24px 0;

          &:last-child {
            margin: 0;
          }

          .preheading {
            font-size: 14px;
            font-weight: 600;
            color: rgba(#ffffff, 0.5);
            text-transform: uppercase;
            margin: 0 0 8px 0;
          }

          .option {
            display: flex;
            justify-content: stretch;
            align-items: stretch;
            margin: 0 0 8px 0;

            .key {
              font-size: 18px;
              font-weight: 400;
              margin: 0 24px 0 0;
            }

            .value {
              flex-grow: 1;
              font-family: Poppins, Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              font-size: 18px;
              font-weight: 500;
              outline: none;
              color: #ffffff;
              border: none;
              background-color: transparent;
            }

            &.chars-option {
              .value {
                font-family: 'Roboto Mono', Poppins, Arial, sans-serif;
                letter-spacing: 0.15em;
              }
            }

            &.checkbox {
              display: flex;
              justify-content: stretch;
              align-items: center;
              position: relative;
              cursor: pointer;

              &:last-child {
                margin: 0;
              }

              input[type='checkbox'] {
                appearance: none;
                background-color: transparent;
                position: relative;
                cursor: pointer;

                &::before {
                  display: block;
                  content: '';
                  width: 20px;
                  height: 20px;
                  border-radius: 8px;
                  border: 2px solid rgba(#ffffff, 0.3);
                  box-sizing: border-box;
                  transition: border 80ms ease;
                }

                &::after {
                  display: block;
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-image: url('@/assets/icons/check.svg');
                  background-position: center center;
                  background-repeat: no-repeat;
                  background-size: 14px;
                  opacity: 0;
                  transition: opacity 80ms ease;
                }

                &:checked {
                  &::before {
                    border: 10px solid #4d54f6;
                  }

                  &::after {
                    opacity: 1;
                  }
                }
              }

              .label {
                font-size: 18px;
                color: #ffffff;
                margin-left: 16px;
              }
            }
          }
        }
      }
    }
  }
}

.headline {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 96px;

  h1 {
    font-size: 96px;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 1;
    color: rgba(#ffffff, 0.8);
    text-align: center;

    span {
      display: block;
      transform: translateX(-15%);

      &:last-child {
        transform: translateX(15%);
      }
    }
  }
}

.content {
  position: relative;
  z-index: 2;
}

.fieldarea {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;

  .field {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 24px 48px;
    background-color: #060615;
    border-radius: 16px;
    border: none;
    font-family: 'Roboto Mono', Poppins, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 32px;
    font-weight: 500;
    letter-spacing: 0.05em;
    line-break: anywhere;
    text-align: center;
    color: #ffffff;
    user-select: all;
    border: 2px solid #4d54f6;
    outline: none;
    min-width: 328px;

    &.filled {
      &::before {
        opacity: 0;
      }
    }

    &::before {
      content: 'Passwort eingeben';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      color: rgba(#ffffff, 0.3);
      pointer-events: none;
      transition: opacity 130ms ease;
    }
  }
}

.safetyLevel {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .level {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-weight: 500;
      text-align: center;

      .number {
        display: inline-flex;
        justify-content: center;
        align-content: center;
        width: 24px;
        height: 24px;
        font-weight: 700;
        line-height: 24px;
        text-align: center;
        border-radius: 50%;
        background-color: #aaaaaa;
        margin-left: 8px;
      }
    }

    .small {
      font-size: 14px;
      font-weight: 400;
      color: rgba(#ffffff, 0.5);
    }
  }
}

.options {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 48px;
  opacity: 0.8;

  .wrapper {
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: stretch;

    .option {
      display: flex;
      justify-content: stretch;
      align-items: center;
      margin: 0 0 16px 0;
      position: relative;

      &.input-option {
        input {
          background: none;
          border: none;
          color: #ffffff;
          font-family: Poppins, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-size: 24px;
          font-weight: 600;
          outline: none;
          width: 48px;
        }

        .label {
          margin-left: 0;
          user-select: none;
        }
      }

      input[type='checkbox'] {
        appearance: none;
        background-color: transparent;
        position: relative;

        &::before {
          display: block;
          content: '';
          width: 20px;
          height: 20px;
          border-radius: 8px;
          border: 2px solid rgba(#ffffff, 0.3);
          box-sizing: border-box;
          transition: border 80ms ease;
        }

        &::after {
          display: block;
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('@/assets/icons/check.svg');
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 14px;
          opacity: 0;
          transition: opacity 80ms ease;
        }

        &:checked {
          &::before {
            border: 10px solid rgba(#ffffff, 0.3);
          }

          &::after {
            opacity: 1;
          }
        }
      }

      .label {
        font-size: 18px;
        color: #ffffff;
        margin-left: 16px;
      }

      .icon {
        opacity: 0;
        margin-left: 0px;
        margin-right: 16px;
        transition: margin 130ms ease, opacity 130ms ease;
        cursor: pointer;
      }

      &:hover {
        .icon {
          margin-left: 16px;
          margin-right: 0px;
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
