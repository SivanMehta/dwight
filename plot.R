library(ggplot2)
library(dplyr)
dat <- read.csv('data.csv')

starting.worth = dat[1, ]$worth

dat %>%
  mutate(cycles = as.numeric(rownames(dat))) %>%
  ggplot() +
    geom_line(aes(cycles, worth), color = 'green') +
    geom_line(aes(cycles, price)) +
    geom_hline(yintercept = starting.worth)
