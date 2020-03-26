library(ggplot2)
library(dplyr)
dat <- read.csv('data.csv')

starting.worth = dat[1, ]$worth
starting.price = dat[1, ]$price

dat %>%
  mutate(cycles = as.numeric(rownames(dat))) %>%
  mutate(relative.worth = worth / starting.worth) %>%
  mutate(relative.price = price / starting.price) %>%
  ggplot() +
    geom_line(aes(cycles, relative.worth), color = 'green') +
    geom_hline(yintercept = 1) +
    geom_line(aes(cycles, relative.price)) +
    labs(y = "Relative Performance")