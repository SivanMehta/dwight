library(ggplot2)
library(dplyr)
dat <- read.csv('data.csv')

starting.worth = dat[1, ]$worth
starting.price = dat[1, ]$price

by.day <- dat %>%
  mutate(cycles = as.numeric(rownames(dat)) %% 2340) %>%
  mutate(relative.worth = worth / starting.worth) %>%
  mutate(relative.price = price / starting.price) %>%
  filter(cycles > 0)

by.day %>%
  ggplot() +
    geom_line(aes(cycles, relative.worth, group = day)) +
    labs(y = "Relative Value of portfolio") +
    geom_hline(yintercept = 1, color = 'red')

ggsave('money.png', width = 9, height = 4)

relative.to.price <- by.day %>%
  mutate(worth.vs.price = relative.worth / relative.price)

relative.to.price %>% ggplot() +
  geom_line(aes(cycles, worth.vs.price, group = day)) +
  labs(y = "Relative Performance of portfolio") +
  geom_hline(yintercept = 1, color = 'red')

ggsave('relative-performance.png', width = 9, height = 4)
